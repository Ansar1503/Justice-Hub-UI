"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import PaginationComponent from "../pagination";
import { useFetchAppointmentsForLawyers } from "@/store/tanstack/queries";
import ClientAppointmentDetailModal from "@/components/Lawyer/Modals/appointmentDetails";
import {
  useConfirmAppointment,
  useRejectAppointment,
} from "@/store/tanstack/mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export type AppointmentStatus =
  | "all"
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"
  | "rejected";
export type AppointmentType = "all" | "consultation" | "follow-up";
export type SortField = "name" | "date" | "consultation_fee" | "created_at";
export type SortOrder = "asc" | "desc";

export default function LawyerClientAppointmentListing() {
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
    useFetchAppointmentsForLawyers({
      appointmentStatus: statusFilter,
      appointmentType: typeFilter,
      sortField: sortBy,
      sortOrder: sortOrder,
      limit: itemsPerPage,
      page: currentPage,
      search: searchTerm,
    });
  const appointments = appointmentData?.data;

  const { mutateAsync: rejectMutation } = useRejectAppointment();
  const { mutateAsync: confirmAppointmentMutation } = useConfirmAppointment();

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
  }, [appointmentData, itemsPerPage]);

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

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await confirmAppointmentMutation({
        id: appointmentId,
        status: "confirmed",
      });
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      await rejectMutation({ id: appointmentId, status: "rejected" });
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  return (
    <div className="h-full p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Client Appointment Management
          </h1>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name..."
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as AppointmentStatus);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as AppointmentType);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>

            <select
              className="w-full col-span-2 sm:col-span-1 appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortField);
                setSortOrder((s) => (s === "asc" ? "desc" : "asc"));
                setCurrentPage(1);
              }}
            >
              <option value="consultation_fee">Sort by Fee</option>
              <option value="date">Sort by Date</option>
              <option value="created_at">Sort by Created</option>
              <option value="name">Sort by Name</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="sm:hidden bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white min-w-[200px]">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Client Details
                      {sortBy === "name" && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white min-w-[150px]">
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
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {appointments?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No appointments found matching your criteria
                    </td>
                  </tr>
                ) : (
                  appointments &&
                  appointments?.map((appointment: any) => (
                    <tr
                      key={appointment?._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border flex-shrink-0">
                            <AvatarImage
                              src={appointment?.clientData?.profile_image}
                              alt={appointment?.userData?.name}
                            />
                            <AvatarFallback>
                              {appointment?.userData?.name
                                ?.substring(0, 2)
                                ?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-base text-gray-900 dark:text-white truncate">
                              {appointment?.userData?.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {appointment?.userData?.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Phone: {appointment?.userData?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {formatDate(appointment?.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="whitespace-nowrap">
                              {formatTimeTo12Hour(appointment?.time)} (
                              {appointment.duration} min)
                            </span>
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
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          ₹{appointment?.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 whitespace-nowrap"
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
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {appointments?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No appointments found matching your criteria
            </div>
          ) : (
            appointments &&
            appointments?.map((appointment: any) => (
              <div
                key={appointment?._id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                {/* Client Info Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 border flex-shrink-0">
                      <AvatarImage
                        src={appointment?.clientData?.profile_image}
                        alt={appointment?.userData?.name}
                      />
                      <AvatarFallback>
                        {appointment?.userData?.name
                          ?.substring(0, 2)
                          ?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {appointment?.userData?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {appointment?.userData?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex-shrink-0 ml-2"
                    onClick={() => handleViewAppointment(appointment)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>

                {/* Appointment Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Date & Time
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                        <Calendar className="h-3 w-3" />
                        {formatDate(appointment?.date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeTo12Hour(appointment?.time)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      Fee
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₹{appointment?.amount}
                    </p>
                  </div>
                </div>

                {/* Status and Type Row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(appointment.status)}
                    {renderTypeBadge(appointment.type)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {appointment.duration} min
                  </div>
                </div>

                {/* Phone Number */}
                {appointment?.userData?.phone && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Phone: {appointment?.userData?.phone}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
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
      <ClientAppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAppointment}
        onReject={handleRejectAppointment}
      />
    </div>
  );
}
