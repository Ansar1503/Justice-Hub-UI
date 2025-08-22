import SearchComponent from "@/components/SearchComponent";
import { AdminLayout } from "./layout/admin.layout";
import { SelectComponent } from "@/components/SelectComponent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import PaginationComponent from "@/components/pagination";
import { UserDetailsModal } from "@/components/admin/Modals/UserDetails.Modal";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Appointment } from "@/types/types/AppointmentsType";
import { Badge } from "@/components/ui/badge";
import AppointmentDetails from "@/components/admin/Modals/AppointmentDetails";
import { useFetchAppointments } from "@/store/tanstack/queries";
type consultationsType = "consultation" | "follow-up" | "all";
type statusType =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected"
  | "all";
type sortByType = "name" | "date" | "amount" | "created_at";
type sortOrderType = "asc" | "desc";
export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [consultationType, setConsultationType] =
    useState<consultationsType>("all");
  const [status, setStatus] = useState<statusType>("all");
  const [sortBy, setSortBy] = useState<sortByType>("date");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  const { data: AppointmentsData } = useFetchAppointments({
    search: searchTerm,
    sortField: sortBy,
    sortOrder,
    appointmentStatus: status,
    appointmentType: consultationType,
    limit: itemsPerPage,
    page: currentPage,
  });
  const appointments = AppointmentsData?.data;
  useEffect(() => {
    if (AppointmentsData) {
      setCurrentPage(AppointmentsData.currentPage);
    }
  }, [AppointmentsData]);
  const totalPages = AppointmentsData?.totalPage || 1;
  const totalCount = AppointmentsData?.totalCount || 1;

  // console.log("appointmentData : ", AppointmentsData);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-800 text-blue-100";
      case "cancelled":
        return "text-gray-800 text-blue-100";
      case "rejected":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "text-gray-800 text-blue-100";
    }
  };

  // constants
  const consultationTypeValues = ["all", "consultation", "follow-up"];
  const statusValues = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "rejected",
    "all",
  ];
  const sortByValues = ["date", "amount", "lawyer_name", "client_name"];
  return (
    <AdminLayout>
      <Card className="bg-textLight dark:bg-stone-800 mt-5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointments Managment</CardTitle>
              <CardDescription>Manage clients Appointments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex gap-3">
              <SearchComponent
                className="w-full "
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="search..."
              />
              {/* consultation Type */}
              <SelectComponent
                className="bg-white/5"
                onSelect={(val: string) => {
                  if (consultationTypeValues.includes(val)) {
                    setConsultationType(val as consultationsType);
                  }
                }}
                values={consultationTypeValues}
                label="Consultation_Type"
                placeholder="Consultation_Type"
              />
              {/* Status */}
              <SelectComponent
                className="bg-white/5"
                onSelect={(val) => {
                  if (statusValues.includes(val)) {
                    setStatus(val as statusType);
                  }
                }}
                values={statusValues}
                label="Status"
                placeholder="Status"
              />
              {/* Sort */}
              <SelectComponent
                className="bg-white/5"
                onSelect={(val) => {
                  if (sortByValues.includes(val)) {
                    setSortBy(val as sortByType);
                  }
                }}
                label="SortBy"
                placeholder="SortBy"
                values={sortByValues}
              />
              {/* sortOrder */}
              <SelectComponent
                className="bg-white/5"
                onSelect={(val) => {
                  if (["asc", "desc"].includes(val)) {
                    setSortOrder(val as sortOrderType);
                  }
                }}
                label="SortOrder"
                placeholder="SortOrder"
                values={["asc", "desc"]}
              />
              <SelectComponent
                onSelect={(val) => {
                  const num = parseInt(val);
                  if (!isNaN(num)) setItemsPerPage(num);
                }}
                label="Items per page"
                placeholder="Items"
                values={["5", "10", "20", "50"]}
              />
            </div>
          </div>
          <div className="rounded-md overflow-hidden border">
            <Table>
              <TableHeader className="bg-stone-600/5 dark:bg-white/10">
                <TableRow>
                  <TableHead>Lawyer</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment?.id}>
                      {/* lawyer */}
                      <TableCell className="p-3  bg-white/5 ">
                        <UserDetailsModal
                          user={appointment.lawyerData}
                          trigger={
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                {appointment.lawyerData.profile_image ? (
                                  <AvatarImage
                                    className="rounded-full w-10"
                                    src={appointment.lawyerData.profile_image}
                                    alt={appointment.lawyerData.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {appointment.lawyerData.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {appointment.lawyerData.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {appointment.lawyerData.email}
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </TableCell>

                      {/* clieint */}
                      <TableCell className="p-3  bg-white/5">
                        <UserDetailsModal
                          user={appointment.clientData}
                          trigger={
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                {appointment.clientData.profile_image ? (
                                  <AvatarImage
                                    className="w-10 rounded-full "
                                    src={appointment.clientData.profile_image}
                                    alt={appointment.clientData.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {appointment.clientData.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {appointment.clientData.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {appointment.clientData.email}
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </TableCell>
                      <TableCell className="p-3  bg-white/5">
                        <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {formatDateTime(appointment.date).date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {appointment.time} ({appointment.duration} min)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3  bg-white/5">
                        <StatusBadge
                          status={appointment?.status}
                          className={`${getStatusColor(appointment?.status)} `}
                        />
                      </TableCell>
                      <TableCell className="p-3  bg-white/5 ">
                        <Badge variant="default">{appointment?.type}</Badge>
                      </TableCell>
                      <TableCell className="p-3  bg-white/5 ">
                        ₹ {appointment.amount}
                      </TableCell>
                      <TableCell className="p-3  bg-white/5 ">
                        <AppointmentDetails
                          appointment={appointment}
                          onOpenChange={setDetailsModalOpen}
                          trigger={
                            <div className="flex justify-center">
                              <Badge
                                className="cursor-pointer"
                                variant="secondary"
                              >
                                view details
                              </Badge>
                            </div>
                          }
                          open={detailsModalOpen}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No Appointments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <PaginationComponent
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalCount}
              totalPages={totalPages}
              handlePageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
