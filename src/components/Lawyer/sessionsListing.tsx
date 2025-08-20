import { useState, useEffect, useContext } from "react";
import { Search, Filter, Eye, Calendar, Clock } from "lucide-react";
import PaginationComponent from "../pagination";
import SessionDetailModal from "@/components/Lawyer/Modals/sessionDetails";
import { useFetchSessionsForLawyers } from "@/store/tanstack/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  useCancelSessionByLawyer,
  useEndSession,
  useJoinSession,
  useStartSession,
} from "@/store/tanstack/mutations/sessionMutation";
// import ZegoVideoCall from "../ZegoCloud";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import CallLogsModal from "../CallLogsModal";
import { SocketContext } from "@/context/SocketProvider";
import { NotificationType } from "@/types/types/Notification";
import { store } from "@/store/redux/store";
import { useAppDispatch } from "@/store/redux/Hook";
import { setZcState } from "@/store/redux/zc/zcSlice";

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
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [viewCallLogsOpen, setViewCallLogsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const socket = useContext(SocketContext);

  const navigate = useNavigate();
  const { mutateAsync: startSessionMutation } = useStartSession();
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const { mutateAsync: CancelSession } = useCancelSessionByLawyer();
  const { mutateAsync: JoinSessionMutation } = useJoinSession();
  const { mutateAsync: endSessionAsync } = useEndSession();
  const { user: currentUser } = store.getState().Auth;
  const { data: sessionsData, refetch: sessionRefetch } =
    useFetchSessionsForLawyers({
      consultation_type: typeFilter,
      limit: itemsPerPage,
      order: sortOrder,
      page: currentPage,
      search: searchTerm,
      sort: sortBy,
      status: statusFilter,
    });
  // console.log("sessionss", sessionsData);
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

  const handleJointSession = async (session: any) => {
    if (session?.room_id) {
      const data = await JoinSessionMutation({
        sessionId: session?._id || "",
      });
      console.log("Joining session:", data);
      dispatch(
        setZcState({
          AppId: data?.zc?.appId,
          roomId: String(data?.room_id),
          token: data?.zc?.token,
        })
      );
      navigate(`/lawyer/session/join/${session?._id}`);
      setSelectedSession(session);
    }
  };
  const handleStartSession = async (session: any) => {
    try {
      if (!socket) {
        console.warn("Socket is null");
        return;
      }

      const data = await startSessionMutation({ sessionId: session?._id });
      // console.log("data", data);
      dispatch(
        setZcState({
          roomId: String(data?.room_id),
          token: data?.zc?.token,
          AppId: data?.zc?.appId,
        })
      );
      const { date, time } = formatDateTime(session?.start_date);
      const notificationData: Omit<NotificationType, "id"> = {
        isRead: false,
        message: `Your Session has been started by the lawyer ${currentUser?.name} on ${date} at ${time} `,
        sessionId: session?._id,
        roomId: data?.room_id,
        recipientId: session?.client_id,
        senderId: session?.lawyer_id,
        title: "Session Started",
        type: "session",
      };
      if (!socket.connected) {
        console.warn("Socket not yet connected. Waiting...");
        socket.connect();
        socket.once("connect", () => {
          console.log("Connected after delay, emitting...");
          socket.emit("NOTIFICATION_SEND", notificationData);
        });
      } else {
        socket.emit("NOTIFICATION_SEND", notificationData);
      }

      if (data?.room_id) {
        console.log("data.roomid is available", data?.room_id);
        navigate(`/lawyer/session/join/${session?._id}`);
        setSelectedSession(session);
      }
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    await endSessionAsync(sessionId);
  };

  const handleCancelSession = async (sessionId: string) => {
    // console.log("Cancelling session:", sessionId);
    await CancelSession({ id: sessionId });
  };

  return (
    <div className="h-full p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Sessions Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your client sessions
          </p>
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
                  setStatusFilter(e.target.value as SessionStatus);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
              >
                <option value="all">All Status</option>
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
              <option value="scheduled_date">Sort by Time</option>
              <option value="amount">Sort by Amount</option>
              <option value="client_name">Sort by Name</option>
              <option value="created_at">Sort by Created</option>
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
                      Scheduled Time
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
                      onClick={() => handleSort("amount")}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Amount
                      {sortBy === "amount" &&
                        (sortOrder === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sessions?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No sessions found matching your criteria
                    </td>
                  </tr>
                ) : (
                  sessions?.map((session: any) => {
                    const { date } = formatDateTime(session?.scheduled_date);
                    return (
                      <tr
                        key={session._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border flex-shrink-0 rounded-full overflow-hidden">
                              <AvatarImage
                                src={session?.clientData?.profile_image}
                                alt={session?.clientData?.name}
                                className="h-full w-full object-cover"
                              />
                              <AvatarFallback className="h-full w-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-300 rounded-full">
                                {session?.clientData?.name
                                  ?.substring(0, 2)
                                  ?.toUpperCase() || "NA"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-base text-gray-900 dark:text-white truncate">
                                {session?.clientData?.name || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {session?.clientData?.email || "N/A"}
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
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">{date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">
                                {session?.scheduled_time} ({session?.duration}{" "}
                                min)
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {renderStatusBadge(session?.status)}
                        </td>
                        <td className="py-4 px-4">
                          {renderTypeBadge(session?.type)}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            ₹{session.amount}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                              onClick={() => handleViewSession(session)}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <Button
                              variant={"ghost"}
                              onClick={() => {
                                setSelectedSession(session);
                                setViewCallLogsOpen(true);
                              }}
                            >
                              📞 Call Logs
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {sessions?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No sessions found matching your criteria
            </div>
          ) : (
            sessions?.map((session: any) => {
              const { date, time } = formatDateTime(session?.scheduled_date);
              return (
                <div
                  key={session._id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  {/* Client Info Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 border flex-shrink-0 rounded-full overflow-hidden">
                        <AvatarImage
                          src={session?.clientData?.profile_image}
                          alt={session?.clientData?.name}
                          className="h-full w-full object-cover"
                        />
                        <AvatarFallback className="h-full w-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-300 rounded-full">
                          {session?.clientData?.name
                            ?.substring(0, 2)
                            ?.toUpperCase() || "NA"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {session?.clientData?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {session?.clientData?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex-shrink-0 ml-2"
                      onClick={() => handleViewSession(session)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>

                  {/* Session Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">
                        Scheduled Time
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">{date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{time}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs block mb-1">
                        Amount
                      </span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{session.amount}
                      </p>
                    </div>
                  </div>

                  {/* Status and Type Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(session?.status)}
                      {renderTypeBadge(session?.type)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session?.duration} min
                    </div>
                  </div>

                  {/* Phone Number */}
                  {session?.clientData?.phone && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Phone: {session?.clientData?.phone}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <CallLogsModal
          session={selectedSession}
          isOpen={viewCallLogsOpen}
          onOpenChange={(b: boolean) => setViewCallLogsOpen(b)}
        />
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
        onJoinSession={handleJointSession}
      />
    </div>
  );
}
