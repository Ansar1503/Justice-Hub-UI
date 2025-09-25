import { useMemo } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SessionDataType } from "@/types/types/sessionType";
import FeedbackModal from "../users/modals/Feedback";
import { useAppSelector } from "@/store/redux/Hook";

interface SessionDetailModalProps {
  session: SessionDataType | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSession?: (session: SessionDataType) => void;
  onEndSession?: (sessionId: string) => void;
  onCancelSession?: (sessionId: string) => void;
  onJoinSession?: (session: SessionDataType) => void;
}

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    iconColor: "text-green-500",
  },
  ongoing: {
    icon: AlertCircle,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    iconColor: "text-blue-500",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    iconColor: "text-red-500",
  },
  missed: {
    icon: XCircle,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    iconColor: "text-red-500",
  },
  upcoming: {
    icon: Clock,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    iconColor: "text-yellow-500",
  },
};

export default function SessionDetailModal({
  session,
  isOpen,
  onClose,
  onStartSession,
  onEndSession,
  onCancelSession,
  onJoinSession,
}: SessionDetailModalProps) {
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { user } = useAppSelector((s) => s.Auth);
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatTime = useCallback((timeString: string | undefined) => {
    if (!timeString) return "";
    const [hourStr, minute] = timeString.split(":");
    let hour = Number.parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  const sessionStartable = useMemo(() => {
    if (!session || !session.room_id) return false;

    const currentDate = new Date();
    const sessionDate = new Date(session?.appointmentDetails?.date);
    const [h, m] = session?.appointmentDetails?.time
      ? session.appointmentDetails.time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + session?.appointmentDetails?.duration * 60000
    );
    return (
      currentDate >= sessionDate &&
      currentDate < sessionEnd &&
      session?.status == "ongoing"
    );
  }, [session]);

  const sessionCancelable = useMemo(() => {
    if (!session || session.status !== "upcoming") return false;

    const currentDate = new Date();
    const sessionDate = new Date(session?.appointmentDetails?.date);
    const [h, m] = session.appointmentDetails?.time
      ? session.appointmentDetails.time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);

    return currentDate < sessionDate;
  }, [session]);

  const getStatusIcon = useCallback((status: SessionDataType["status"]) => {
    const config = STATUS_CONFIG[status];
    const IconComponent = config?.icon;
    return <IconComponent className={`h-5 w-5 ${config?.iconColor}`} />;
  }, []);

  const getStatusColor = useCallback((status: SessionDataType["status"]) => {
    return STATUS_CONFIG[status]?.color;
  }, []);

  const handleStartSession = useCallback(() => {
    if (session) {
      onStartSession?.(session);
      setShowStartConfirm(false);
      onClose();
    }
  }, [session, onStartSession, onClose]);
  const handleJoinSession = useCallback(() => {
    if (session) {
      onJoinSession?.(session);
      setShowJoinConfirm(false);
      onClose();
    }
  }, [session, onJoinSession, onClose]);

  const handleEndSession = useCallback(() => {
    if (session) {
      onEndSession?.(session.id);
      setShowEndConfirm(false);
      onClose();
    }
  }, [session, onEndSession, onClose]);

  const handleCancelSession = useCallback(() => {
    if (session) {
      onCancelSession?.(session.id);
      setShowCancelConfirm(false);
      onClose();
    }
  }, [session, onCancelSession, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !session) return null;
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon(session.status)}
              <DialogTitle className="text-xl">Session Details</DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status and Session Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Session Status
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    session.status
                  )}`}
                >
                  {session.status}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Session Type
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                  {session?.appointmentDetails?.type === "consultation"
                    ? "Consultation"
                    : "Follow-up"}
                </span>
              </div>
            </div>

            {/* Lawyer Information */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Lawyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Name
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                      <AvatarImage
                        src={session?.lawyerData?.profile_image || ""}
                        alt={session?.lawyerData?.name}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full">
                        {session?.lawyerData?.name
                          ?.substring(0, 2)
                          ?.toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session?.lawyerData?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session?.lawyerData?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session?.lawyerData?.mobile || "N/A"}
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
                      {formatDate(
                        session?.appointmentDetails?.date?.toString()
                      )}
                      , {formatTime(session?.appointmentDetails?.time)}
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
                      {formatDuration(session?.appointmentDetails?.duration)}
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
                      ₹{session.appointmentDetails?.amount || "N/A"}
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
                      {formatDate(session.start_time?.toString())}
                    </p>
                  </div>
                )}

                {session.end_time && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ended At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session.end_time?.toString())}
                    </p>
                  </div>
                )}

                {session.client_joined_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client Joined At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session?.appointmentDetails?.date.toString())}{" "}
                      at {formatTime(session?.appointmentDetails?.time)}
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
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                {session?.appointmentDetails?.reason}
              </p>
            </div>

            {/* Follow-up Information */}
            {session?.follow_up_suggested && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Follow-up Suggested
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  A follow-up session has been suggested for this client.
                </p>
              </div>
            )}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              {user?.role !== "lawyer" && (
                <Button
                  variant={"default"}
                  className="w-full"
                  onClick={() => {
                    if (user?.role != "lawyer") {
                      setShowFeedbackModal(true);
                    }
                  }}
                >
                  View Feedback & Reviews
                </Button>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <div className="flex gap-3">
              {session.status === "upcoming" && (
                <>
                  {sessionCancelable && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel Session
                    </Button>
                  )}
                </>
              )}

              {session.status === "ongoing" && (
                <>
                  {sessionStartable && (
                    <Button
                      onClick={() => setShowStartConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  )}

                  <Button
                    onClick={() => setShowJoinConfirm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Session
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setShowEndConfirm(true)}
                  >
                    End Session
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you ready to join this session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Join</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStartSession}
            >
              Yes, start session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showJoinConfirm} onOpenChange={setShowJoinConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join Session</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to join this ongoing session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleJoinSession}
            >
              Yes, join session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this session? This action cannot be
              undone and the session will be marked as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleEndSession}
            >
              Yes, end session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this session? This action cannot
              be undone and the client will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep session</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelSession}
            >
              Yes, cancel session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <FeedbackModal
        sessionId={session?.id || ""}
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        lawyerId={session.lawyerData?.user_id || ""}
        lawyerName={session.lawyerData.name || "Unknown Lawyer"}
      />
    </>
  );
}
