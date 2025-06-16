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
import { useState } from "react";

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
  // const [notes, setNotes] = useState(session?.notes || "");
  // const [summary, setSummary] = useState(session?.summary || "");

  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
  const sessionStartable = () => {
    const currentDate = new Date();
    const sessionDate = new Date(session?.scheduled_at);
    const [h, m] = session?.time ? session.time.split(":").map(Number) : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + session.duration * 60000
    );
    return (
      session?.status === "upcoming" &&
      currentDate >= sessionDate &&
      currentDate < sessionEnd
    );
  };

  const sessionCancelable = () => {
    const currentDate = new Date();
    const sessionDate = new Date(session?.scheduled_at);
    const [h, m] = session?.time ? session.time.split(":").map(Number) : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    return session?.status === "upcoming" && currentDate < sessionDate;
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

  const handleStartSession = () => {
    onStartSession?.(session._id);
    setShowStartConfirm(false);
    onClose();
  };

  const handleEndSession = () => {
    onEndSession?.(session._id);
    setShowEndConfirm(false);
    onClose();
  };

  const handleCancelSession = () => {
    onCancelSession?.(session._id);
    setShowCancelConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon(session?.status)}
              <DialogTitle className="text-xl">Session Details</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status and Payment Info */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Session Status
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    session?.status
                  )}`}
                >
                  {session?.status}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Session Type
                </h3>
                <span className="inline-flex items-center px-2 py-1 rounded border border-gray-300 text-xs font-medium bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                  {session.type === "consultation"
                    ? "Consultation"
                    : "Follow-up"}
                </span>
              </div>
            </div>

            {/* Client Information */}
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
                        src={
                          session?.clientData?.profile_image ||
                          "/placeholder.svg"
                        }
                        alt={session?.userData?.name}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full">
                        {session?.userData?.name
                          ?.substring(0, 2)
                          ?.toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session?.userData?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session?.userData?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session?.clientData?.phone || "N/A"}
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
                      {formatDateTime(session?.scheduled_at)}
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
                      {formatDuration(session?.duration)}
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
                      {formatDateTime(session?.start_time)}
                    </p>
                  </div>
                )}

                {session.end_time && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ended At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(session?.end_time)}
                    </p>
                  </div>
                )}

                {session.client_joined_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client Joined At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(session?.client_joined_at)}
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
                {session?.reason}
              </p>
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

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-3">
              {session?.status === "upcoming" && (
                <>
                  {sessionStartable() && (
                    <Button
                      onClick={() => setShowStartConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  )}
                  {sessionCancelable() && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel Session
                    </Button>
                  )}
                </>
              )}

              {session?.status === "ongoing" && (
                <Button
                  variant="destructive"
                  onClick={() => setShowEndConfirm(true)}
                >
                  End Session
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Session Confirmation Dialog */}
      <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you ready to start this session? The client will be notified
              and the session will begin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStartSession}
            >
              Yes, start session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Session Confirmation Dialog */}
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

      {/* Cancel Session Confirmation Dialog */}
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
    </>
  );
}
