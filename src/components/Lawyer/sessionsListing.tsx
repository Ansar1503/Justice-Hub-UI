"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Calendar, Clock, Video } from "lucide-react";
import PaginationComponent from "../pagination";
import SessionDetailModal from "@/components/Lawyer/Modals/sessionDetails";

export type SessionStatus =
  | "all"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export type SessionType = "all" | "consultation" | "follow-up";
export type PaymentStatus = "all" | "pending" | "success" | "failed";
export type SortField =
  | "client_name"
  | "scheduled_at"
  | "amount"
  | "created_at";
export type SortOrder = "asc" | "desc";

const mockSessions = [
  {
    _id: "1",
    appointment_id: "apt_001",
    lawyer_id: "lawyer_001",
    client_id: "client_001",
    scheduled_at: "2024-01-15T10:00:00Z",
    duration: 60,
    reason: "Legal consultation regarding property dispute",
    amount: 2000,
    payment_status: "success",
    type: "consultation",
    status: "completed",
    start_time: "2024-01-15T10:00:00Z",
    end_time: "2024-01-15T11:00:00Z",
    client_joined_at: "2024-01-15T09:58:00Z",
    lawyer_joined_at: "2024-01-15T10:00:00Z",
    notes: "Client discussed property boundary issues",
    summary: "Advised on legal options for property dispute resolution",
    follow_up_suggested: true,
    clientData: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
    },
  },
  {
    _id: "2",
    appointment_id: "apt_002",
    lawyer_id: "lawyer_001",
    client_id: "client_002",
    scheduled_at: "2024-01-16T14:00:00Z",
    duration: 45,
    reason: "Follow-up on divorce proceedings",
    amount: 1500,
    payment_status: "pending",
    type: "follow-up",
    status: "upcoming",
    clientData: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+91 9876543211",
    },
  },
];

export default function SessionsListing() {
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<SessionStatus>("all");
  const [typeFilter, setTypeFilter] = useState<SessionType>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus>("all");
  const [sortBy, setSortBy] = useState<SortField>("scheduled_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };
  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch =
      session.clientData.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      session.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    const matchesPayment =
      paymentFilter === "all" || session.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPayment;
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSessions.length / itemsPerPage));
  }, [filteredSessions, itemsPerPage]);

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

  const renderPaymentBadge = (status: string) => {
    const statusConfig = {
      success: {
        label: "Paid",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      failed: {
        label: "Failed",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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

  const handleStartSession = async (sessionId: string) => {
    // Implement start session logic
    console.log("Starting session:", sessionId);
  };

  const handleEndSession = async (sessionId: string) => {
    // Implement end session logic
    console.log("Ending session:", sessionId);
  };

  const handleCancelSession = async (sessionId: string) => {
    // Implement cancel session logic
    console.log("Cancelling session:", sessionId);
  };

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as PaymentStatus);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
            >
              <option value="all">All Payments</option>
              <option value="success">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
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
                    onClick={() => handleSort("client_name")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Client Details
                    {sortBy === "client_name" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleSort("scheduled_at")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Scheduled Time
                    {sortBy === "scheduled_at" &&
                      (sortOrder === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  Payment
                </th>
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
              {paginatedSessions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No sessions found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((session) => {
                  const { date, time } = formatDateTime(session.scheduled_at);
                  return (
                    <tr
                      key={session._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                              {getInitials(session.clientData.name)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-base text-gray-900 dark:text-white">
                              {session.clientData.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session.clientData.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {session.clientData.phone}
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
                            {time} ({session.duration} min)
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {renderStatusBadge(session.status)}
                      </td>
                      <td className="py-4 px-4">
                        {renderTypeBadge(session.type)}
                      </td>
                      <td className="py-4 px-4">
                        {renderPaymentBadge(session.payment_status)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{session.amount}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {session.status === "upcoming" && (
                            <button
                              onClick={() => handleStartSession(session._id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                            >
                              <Video className="h-3 w-3" />
                              Start
                            </button>
                          )}
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
          totalItems={filteredSessions.length}
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
