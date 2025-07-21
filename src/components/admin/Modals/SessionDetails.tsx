import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  ClockIcon,
  IndianRupeeIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  VideoIcon,
  FileTextIcon,
  UserIcon,
  ArrowRightIcon,
  StickyNoteIcon,
} from "lucide-react";
import type { Session } from "@/types/types/sessionType";
import type {
  clientDataType,
  userDataType,
} from "@/types/types/Client.data.type";
import Confirmation from "@/components/Confirmation";

interface SessionDetailsProps {
  session: Session & {
    clientData: userDataType & clientDataType;
    lawyerData: userDataType & clientDataType;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStartSession?: (session: any) => void;
  onEndSession?: (sessionId: string) => void;
  onCancelSession?: (sessionId: string) => void;
  onJoinSession?: (session: any) => void;
}

export default function SessionDetails({
  session,
  trigger,
  open,
  onOpenChange,
  //   onStartSession,
  //   onEndSession,
  //   onCancelSession,
  onJoinSession,
}: SessionDetailsProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  
  //   const [showStartConfirm, setShowStartConfirm] = useState(false);
  //   const [showEndConfirm, setShowEndConfirm] = useState(false);
  //   const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "";
    const [hourStr, minute] = timeString.split(":");
    let hour = Number.parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "ongoing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "missed":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "upcoming":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "ongoing":
        return <AlertCircleIcon className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "cancelled":
      case "missed":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Session control logic
  //   const sessionStartable = () => {
  //     const currentDate = new Date();
  //     const sessionDate = new Date(session.scheduled_date);
  //     const [h, m] = session.scheduled_time
  //       ? session.scheduled_time.split(":").map(Number)
  //       : [0, 0];
  //     sessionDate.setHours(h, m, 0, 0);
  //     const sessionEnd = new Date(
  //       sessionDate.getTime() + session.duration * 60000
  //     );

  //     return (
  //       session.status === "upcoming" &&
  //       currentDate >= sessionDate &&
  //       currentDate < sessionEnd
  //     );
  //   };

  const sessionJoinable = () => {
    const currentDate = new Date();
    const sessionDate = new Date(session.scheduled_date);
    const [h, m] = session.scheduled_time
      ? session.scheduled_time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + session.duration * 60000
    );

    return (
      session.status === "ongoing" &&
      currentDate >= sessionDate &&
      currentDate < sessionEnd
    );
  };

  //   const sessionCancelable = () => {
  //     const currentDate = new Date();
  //     const sessionDate = new Date(session.scheduled_date);
  //     const [h, m] = session.scheduled_time
  //       ? session.scheduled_time.split(":").map(Number)
  //       : [0, 0];
  //     sessionDate.setHours(h, m, 0, 0);

  //     return session.status === "upcoming" && currentDate < sessionDate;
  //   };
  // Action handlers
  //   const handleStartSession = () => {
  //     onStartSession?.(session);
  //     setShowStartConfirm(false);
  //     handleOpenChange(false);
  //   };

  //   const handleEndSession = () => {
  //     onEndSession?.(session._id!);
  //     setShowEndConfirm(false);
  //     handleOpenChange(false);
  //   };

  //   const handleCancelSession = () => {
  //     onCancelSession?.(session._id!);
  //     setShowCancelConfirm(false);
  //     handleOpenChange(false);
  //   };

  const handleJoinSession = () => {
    onJoinSession?.(session);
    setShowJoinConfirm(false);
    handleOpenChange(false);
  };

  return (
    <>
      <Dialog
        open={open !== undefined ? open : isOpen}
        onOpenChange={handleOpenChange}
      >
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon(session.status)}
              <DialogTitle className="text-xl">Session Details</DialogTitle>
            </div>
            <DialogDescription>
              Complete information about this consultation session
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 ">
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
                  {session.status.charAt(0).toUpperCase() +
                    session.status.slice(1)}
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
            {/* Lawyer Information */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Lawyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Name
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          session.lawyerData?.profile_image ||
                          "/placeholder.svg"
                        }
                        alt={session.lawyerData?.name}
                      />
                      <AvatarFallback>
                        {getInitials(session.lawyerData?.name || "Unknown")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.lawyerData?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.lawyerData?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.lawyerData?.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Client Information */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Name
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          session.clientData?.profile_image ||
                          "/placeholder.svg"
                        }
                        alt={session.clientData?.name}
                      />
                      <AvatarFallback>
                        {getInitials(session.clientData?.name || "Unknown")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.clientData?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
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
                      {session.clientData?.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Scheduled At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session.scheduled_date)},{" "}
                      {formatTime(session.scheduled_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
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
                  <IndianRupeeIcon className="h-5 w-5 text-gray-400" />
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
            </div>
            {/* Reason */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Reason for Consultation
              </h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                {session.reason || "No reason provided"}
              </p>
            </div>
            {/* Session Notes */}
            {session.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <StickyNoteIcon className="h-5 w-5" />
                  Session Notes
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {session.notes}
                </p>
              </div>
            )}
            {/* Session Summary */}
            {session.summary && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Session Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {session.summary}
                </p>
              </div>
            )}
            {/* Follow-up Information */}
            {(session.follow_up_suggested || session.follow_up_session_id) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <ArrowRightIcon className="h-5 w-5" />
                  Follow-up Information
                </h3>
                {session.follow_up_suggested && (
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    A follow-up session has been suggested for this client.
                  </p>
                )}
                {session.follow_up_session_id && (
                  <p className="text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Follow-up Session ID:</span>{" "}
                    <span className="font-mono">
                      {session.follow_up_session_id}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
            <div className="flex gap-3">
              {session.status === "upcoming" && (
                <>
                  {/* {sessionStartable() && (
                    <Button
                      onClick={() => setShowStartConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <VideoIcon className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  )} */}
                  {/* {sessionCancelable() && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel Session
                    </Button>
                  )} */}
                </>
              )}

              {sessionJoinable() && (
                <Button
                  onClick={() => setShowJoinConfirm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Join Session
                </Button>
              )}

              {/* {session.status === "ongoing" && (
                <Button
                  variant="destructive"
                  onClick={() => setShowEndConfirm(true)}
                >
                  End Session
                </Button>
              )} */}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Session Confirmation */}
      {/* <Confirmation
        description="Are you ready to start this session? The client will be notified
              and the session will begin."
        handleAction={handleStartSession}
        open={showStartConfirm}
        setOpen={setShowStartConfirm}
        title="Start Session"
        className="bg-green-600 hover:bg-green-700"
        actionText="Yes, start session"
      /> */}

      {/* Join Session Confirmation */}
      <Confirmation
        description="Are you ready to join this session?"
        handleAction={handleJoinSession}
        open={showJoinConfirm}
        setOpen={setShowJoinConfirm}
        title="Join Session"
        className="bg-green-600 hover:bg-green-700"
        actionText="Yes, join session"
      />

      {/* End Session Confirmation */}
      {/* <Confirmation
        description=" Are you sure you want to end this session? This action cannot be
              undone and the session will be marked as completed."
        handleAction={handleEndSession}
        open={showEndConfirm}
        setOpen={setShowEndConfirm}
        title="End Session"
        className="bg-red-600 hover:bg-red-700"
        actionText="Yes, end session"
      /> */}

      {/* Cancel Session Confirmation */}
      {/* <Confirmation
        description=" Are you sure you want to cancel this session? This action cannot be undone and the client will be
              notified."
        handleAction={handleCancelSession}
        open={showCancelConfirm}
        setOpen={setShowCancelConfirm}
        title="Cancel Session"
        className="bg-red-600 hover:bg-red-700"
        actionText="Yes, cancel session"
      /> */}
    </>
  );
}
