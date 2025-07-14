import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLayout } from "./layout/admin.layout";
import SearchComponent from "@/components/SearchComponent";
import { useState } from "react";
import { SelectComponent } from "@/components/SelectComponent";
import { useFetchSessionsForAdmin } from "@/store/tanstack/queries";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UserDetailsModal } from "@/components/admin/Modals/UserDetails.Modal";
import { Calendar, Clock } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Session } from "@/types/types/sessionType";
import { Badge } from "@/components/ui/badge";
import SessionDetails from "@/components/admin/Modals/SessionDetails";
import PaginationComponent from "@/components/pagination";

type consultationsType = "consultation" | "follow-up" | "all";
type statusType =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed"
  | "all";
type sortByType = "date" | "amount" | "lawyer_name" | "client_name";
type sortOrderType = "asc" | "desc";

export default function Sessions() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [consultationType, setConsultationType] =
    useState<consultationsType>("all");
  const [status, setStatus] = useState<statusType>("all");
  const [sortBy, setSortBy] = useState<sortByType>("date");
  const [sortOrder, setSortOrder] = useState<sortOrderType>("asc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  const { data: sessionData } = useFetchSessionsForAdmin({
    limit: itemsPerPage,
    page: currentPage,
    search: searchTerm,
    type: consultationType,
    status,
    sortBy,
    sortOrder,
  });
  // console.log("sessionsdDAta", sessionData);
  const sessions = sessionData?.data;
  const totalPages = sessionData?.totalPage || 1;
  const totalCount = sessionData?.totalCount || 1;

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
  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "missed":
        return "text-gray-800 text-blue-100";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-800 text-blue-100";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "text-gray-800 text-blue-100";
    }
  };
  // constants
  const consultationTypeValues = ["all", "consultation", "follow-up"];
  const statusValues = [
    "upcoming",
    "ongoing",
    "completed",
    "cancelled",
    "missed",
    "all",
  ];
  const sortByValues = ["date", "amount", "lawyer_name", "client_name"];
  return (
    <AdminLayout>
      <Card className="bg-textLight dark:bg-stone-800 mt-5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sessions Managment</CardTitle>
              <CardDescription>Manage clients-Lawyer Session</CardDescription>
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
              {/* consultation type select component */}
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
                {sessions && sessions.length > 0 ? (
                  sessions.map((session) => (
                    <TableRow key={session?._id}>
                      {/* lawyer */}
                      <TableCell className="p-3  bg-white/5 ">
                        <UserDetailsModal
                          user={session.lawyerData}
                          trigger={
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                {session.lawyerData.profile_image ? (
                                  <AvatarImage
                                    className="rounded-full w-10"
                                    src={session.lawyerData.profile_image}
                                    alt={session.lawyerData.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {session.lawyerData.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {session.lawyerData.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {session.lawyerData.email}
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </TableCell>
                      <TableCell className="p-3 bg-white/5 ">
                        <UserDetailsModal
                          user={session.clientData}
                          trigger={
                            <div className="flex items-center gap-3 cursor-pointer">
                              <Avatar>
                                {session.clientData.profile_image ? (
                                  <AvatarImage
                                    className="rounded-full w-10"
                                    src={session.clientData.profile_image}
                                    alt={session.clientData.name}
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {session.clientData.name
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {session.clientData.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {session.clientData.email}
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
                            {
                              formatDateTime(String(session.scheduled_date))
                                .date
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {session.scheduled_time} ({session.duration} min)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-3  bg-white/5">
                        <StatusBadge
                          status={session?.status}
                          className={`${getStatusColor(session?.status)} `}
                        />
                      </TableCell>
                      <TableCell className="p-3  bg-white/5 ">
                        <Badge variant="default">{session?.type}</Badge>
                      </TableCell>
                      <TableCell className="p-3  bg-white/5 ">
                        ₹ {session.amount}
                      </TableCell>
                      <TableCell className="p-3 bg-white/5">
                        <SessionDetails
                          session={session}
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
                      No users found.
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
