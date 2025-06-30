"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Calendar, Clock } from "lucide-react";
import PaginationComponent from "../pagination";
import SessionDetailModal from "@/components/users/modals/sessionDetails";
import { useFetchsessionsForclients } from "@/store/tanstack/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useCancelSessionByClient } from "@/store/tanstack/mutations/sessionMutation";
import ZegoVideoCall from "../ZegoCloud";

export type SessionStatus =
  | "all"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export type SessionType = "all" | "consultation" | "follow-up";
export type PaymentStatus = "all" | "pending" | "success" | "failed";
export type SortField = "name" | "date" | "amount" | "created_at";
export type SortOrder = "asc" | "desc";

export default function SessionsListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<SessionStatus>("all");
  const [typeFilter, setTypeFilter] = useState<SessionType>("all");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [zegoRoomID, setZegoRoomID] = useState("");

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const { mutateAsync: sessionCancel } = useCancelSessionByClient();

  const { data: sessionsData, refetch: sessionRefetch } =
    useFetchsessionsForclients({
      consultation_type: typeFilter,
      limit: itemsPerPage,
      order: sortOrder,
      page: currentPage,
      search: searchTerm,
      sort: sortBy,
      status: statusFilter,
    });
  //   console.log("datad", sessionsData);
  const sessions = sessionsData?.data;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      sessionRefetch();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, sessionRefetch]);
  useEffect(() => {
    sessionRefetch();
  }, [
    statusFilter,
    typeFilter,
    sortBy,
    sortOrder,
    itemsPerPage,
    currentPage,
    sessionRefetch,
  ]);

  useEffect(() => {
    if (sessionsData?.totalCount) {
      setTotalPages(Math.ceil(sessionsData.totalCount / itemsPerPage));
    }
  }, [sessionsData, itemsPerPage]);

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      upcoming: {
        label: "Upcoming",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      ongoing: {
        label: "Ongoing",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      completed: {
        label: "Completed",
        className:
          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      missed: {
        label: "Missed",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.upcoming;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  if (showVideo && selectedSession) {
    return (
      <div className="w-full h-full">
        <ZegoVideoCall
          roomID={zegoRoomID}
          userID={selectedSession?.userData?._id}
          userName={selectedSession?.userData?.name}
        />
      </div>
    );
  }

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

  const renderTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
        {type === "consultation" ? "Consultation" : "Follow-up"}
      </span>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewSession = (session: any) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleStartSession = async (session: any) => {
    if (session?.room_id) {
      setZegoRoomID(session?.room_id);
      setSelectedSession(session);
      setShowVideo(true);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    console.log("Ending session:", sessionId);
  };

  const handleCancelSession = async (sessionId: string) => {
    console.log("Cancelling session in client:", sessionId);
    await sessionCancel({ id: sessionId });
    setIsModalOpen(false);
  };

  return (
    <div className="h-full p-6 bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sessions Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your client sessions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name or session details"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as SessionStatus);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as SessionType);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Lawyer Details
                    {sortBy === "name" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Scheduled Time
                    {sortBy === "date" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment
                </th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Amount
                    {sortBy === "amount" && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sessions?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No sessions found matching your criteria
                  </td>
                </tr>
              ) : (
                sessions?.map((session: any) => {
                  const { date, time } = formatDateTime(
                    session?.scheduled_date
                  );
                  return (
                    <tr
                      key={session._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                            <AvatarImage
                              src={session?.clientData?.profile_image}
                              alt={session?.userData?.name}
                              className="rounded-full"
                            />
                            <AvatarFallback className="rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                              {session?.userData?.name
                                ?.substring(0, 2)
                                ?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-base text-gray-900 dark:text-white">
                              {session?.userData?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session?.userData?.email || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {session?.clientData?.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-3 w-3" />
                            {date}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            {time} ({session?.duration} min)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {renderStatusBadge(session?.status)}
                      </td>
                      <td className="py-4 px-4">
                        {renderTypeBadge(session?.type)}
                      </td>
                      {/* <td className="py-4 px-4">
                        {renderPaymentBadge(session?.payment_status)}
                      </td> */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{session.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* {session?.status === "upcoming" && (
                            <button
                              onClick={() => handleStartSession(session._id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                            >
                              <Video className="h-3 w-3" />
                              Start
                            </button>
                          )} */}
                          <button
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                            onClick={() => handleViewSession(session)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <PaginationComponent
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={sessionsData?.totalCount ?? 0}
          totalPages={totalPages}
        />
      </div>

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={selectedSession}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        onCancelSession={handleCancelSession}
      />
    </div>
  );
}
