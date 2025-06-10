"use client";

import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  DollarSign,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface SessionDetailModalProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onStartSession?: (sessionId: string) => void;
  onEndSession?: (sessionId: string) => void;
  onCancelSession?: (sessionId: string) => void;
}

export default function SessionDetailModal({
  session,
  isOpen,
  onClose,
  onStartSession,
  onEndSession,
  onCancelSession,
}: SessionDetailModalProps) {
  const [notes, setNotes] = useState(session?.notes || "");
  const [summary, setSummary] = useState(session?.summary || "");

  if (!isOpen || !session) return null;

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
      case "missed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "ongoing":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "missed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {getStatusIcon(session.status)}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Session Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Session Status
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  session.status
                )}`}
              >
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Payment Status
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                  session.payment_status
                )}`}
              >
                {session.payment_status.charAt(0).toUpperCase() +
                  session.payment_status.slice(1)}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Session Type
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                {session.type === "consultation" ? "Consultation" : "Follow-up"}
              </span>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User className="h-5 w-5" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.clientData?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.clientData?.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.clientData?.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scheduled At
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(session.scheduled_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDuration(session.duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₹{session.amount}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {session.start_time && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Started At
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(session.start_time)}
                  </p>
                </div>
              )}

              {session.end_time && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ended At
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(session.end_time)}
                  </p>
                </div>
              )}

              {session.client_joined_at && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Client Joined At
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDateTime(session.client_joined_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reason for Consultation
            </h3>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {session.reason}
            </p>
          </div>

          {/* Notes and Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Session Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add session notes..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Session Summary
              </h3>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Add session summary..."
                className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Follow-up Information */}
          {session.follow_up_suggested && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">
                Follow-up Suggested
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                A follow-up session has been suggested for this client.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {session.status === "upcoming" && (
            <>
              <button
                onClick={() => onStartSession?.(session._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Start Session
              </button>
              <button
                onClick={() => onCancelSession?.(session._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Session
              </button>
            </>
          )}

          {session.status === "ongoing" && (
            <button
              onClick={() => onEndSession?.(session._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              End Session
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
