import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import PaginationComponent from "../pagination";
import {
  useFetchAppointments,
} from "@/store/tanstack/queries";
import AppointmentDetailModal from "@/components/users/modals/AppointmentDetails.modal";
import { useCancellAppointment } from "@/store/tanstack/mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export type AppointmentStatus =
  | "all"
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected";
export type AppointmentType = "all" | "consultation" | "follow-up";
export type SortField =
  | "lawyer_name"
  | "date"
  | "consultation_fee"
  | "created_at";
export type SortOrder = "asc" | "desc";

export default function LawyerAppointmentListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("all");
  const [typeFilter, setTypeFilter] = useState<AppointmentType>("all");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const { data: appointmentData, refetch: refetchAppointment } =
    useFetchAppointments({
      appointmentStatus: statusFilter,
      appointmentType: typeFilter,
      sortField: sortBy,
      sortOrder: sortOrder,
      limit: itemsPerPage,
      page: currentPage,
      search: searchTerm,
    });
  const { mutateAsync: cancelAppointmentMutate } = useCancellAppointment();
  const appointments = appointmentData?.data ?? [];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      refetchAppointment();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, refetchAppointment]);

  useEffect(() => {
    if (appointmentData?.totalCount) {
      setTotalPages(Math.ceil(appointmentData.totalCount / itemsPerPage));
    }
  }, [itemsPerPage, appointmentData?.totalCount]);

  useEffect(() => {
    refetchAppointment();
  }, [
    statusFilter,
    typeFilter,
    sortBy,
    sortOrder,
    itemsPerPage,
    currentPage,
    refetchAppointment,
  ]);

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        label: "Confirmed",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      completed: {
        label: "Completed",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-200 text-red-900 dark:bg-red-800 dark:text-red-100",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const formatTimeTo12Hour = (time: string) => {
    const [hourStr, minute] = time.split(":");
    let hour = Number.parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const renderTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
        {type === "consultation" ? "Consultation" : "Follow-up"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointmentMutate({ id: appointmentId, status: "cancelled" });
    } catch (error) {
      console.log("error,", error);
    }
  };

  // const getSortDisplayText = () => {
  //   const fieldNames = {
  //     lawyer_name: "Lawyer Name",
  //     appointment_date: "Date",
  //     fee: "Fee",
  //     created_at: "Created Date",
  //   };
  //   return `${fieldNames[sortBy]} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`;
  // };

  return (
    <div className="h-full p-6 bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lawyer Appointment Management
          </h1>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by lawyer name or specialization"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as AppointmentStatus);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as AppointmentType);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>

            {/* Fixed Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field as SortField);
                  setSortOrder(order as SortOrder);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-8 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white min-w-[140px]"
              >
                <option value="appointment_date-desc">Date (Newest)</option>
                <option value="appointment_date-asc">Date (Oldest)</option>
                <option value="lawyer_name-asc">Lawyer (A-Z)</option>
                <option value="lawyer_name-desc">Lawyer (Z-A)</option>
                <option value="consultation_fee-asc">Fee (Low-High)</option>
                <option value="consultation_fee-desc">Fee (High-Low)</option>
              </select>
              <ArrowUpDown className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("lawyer_name")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Lawyer Details
                    {sortBy === "lawyer_name" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Date & Time
                    {sortBy === "date" && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("consultation_fee")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Fee
                    {sortBy === "consultation_fee" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No appointments found matching your criteria
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr
                    key={appointment?.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4 rounded-full">
                      <div className="flex items-center gap-3 ">
                        <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                          <AvatarImage
                            src={appointment?.lawyerData?.profile_image}
                            alt={appointment?.lawyerData?.name}
                            className="rounded-full"
                          />
                          <AvatarFallback className="rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                            {appointment?.lawyerData?.name
                              ?.substring(0, 2)
                              ?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-base text-gray-900 dark:text-white">
                            {appointment?.lawyerData?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                          <Calendar className="h-3 w-3" />
                          {formatDate(appointment?.date)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatTimeTo12Hour(appointment?.time)} (
                          {appointment.duration} min)
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {renderStatusBadge(appointment.status)}
                    </td>
                    <td className="py-4 px-4">
                      {renderTypeBadge(appointment.type)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{appointment?.amount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationComponent
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={appointmentData?.totalCount ?? 0}
          totalPages={totalPages}
        />
      </div>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={handleCancelAppointment}
      />
    </div>
  );
}
