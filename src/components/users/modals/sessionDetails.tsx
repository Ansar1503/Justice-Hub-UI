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
import { Input } from "@/components/ui/input";
import { Progress } from "@radix-ui/react-progress";
import { useRef, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useDocumentUpdateMutation } from "@/store/tanstack/mutations/DocumentMutation";
import { useFetchSessionDocuments } from "@/store/tanstack/queries";
import { SessionDocumentsPreview } from "@/components/sessionDocumentsPreview";
import { useRemoveFile } from "@/store/tanstack/mutations/sessionMutation";

interface Session {
  _id: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
  type: "consultation" | "follow-up";
  scheduled_date: string;
  scheduled_time: string;
  scheduled_at: string;
  duration: number;
  amount: number;
  reason: string;
  room_id?: string;
  start_time?: string;
  end_time?: string;
  client_joined_at?: string;
  follow_up_suggested?: boolean;
  userData: any;
  clientData: any;
}

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onStartSession?: (session: Session) => void;
  onEndSession?: (sessionId: string) => void;
  onCancelSession?: (sessionId: string) => void;
}

// Constants
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 3;

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
}: SessionDetailModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sessionDocumentsData } = useFetchSessionDocuments(
    session?._id || ""
  );
  const sessionDocuments = sessionDocumentsData?.data;
  const { mutateAsync: uploadDocuments, isPending: documentUploading } =
    useDocumentUpdateMutation();

  const { mutateAsync: removeFile, isPending: fileRemoving } = useRemoveFile(
    sessionDocuments?.session_id || ""
  );

  // Utility functions
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
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, []);

  // Validation functions
  const validateFile = useCallback((file: File): boolean => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isAllowedType =
      ALLOWED_FILE_TYPES.includes(fileType) ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx");

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size should be less than 10MB");
      return false;
    }

    if (!isAllowedType) {
      toast.error("Only PDF, DOC, DOCX, JPG, PNG, JPEG files are allowed");
      return false;
    }

    return true;
  }, []);

  // Session status checks
  const sessionStartable = useMemo(() => {
    if (!session || session.status !== "upcoming" || !session.room_id)
      return false;

    const currentDate = new Date();
    const sessionDate = new Date(session.scheduled_at);
    const [h, m] = session.scheduled_time
      ? session.scheduled_time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + session.duration * 60000
    );

    return currentDate >= sessionDate && currentDate < sessionEnd;
  }, [session]);

  const sessionCancelable = useMemo(() => {
    if (!session || session.status !== "upcoming") return false;

    const currentDate = new Date();
    const sessionDate = new Date(session.scheduled_date);
    const [h, m] = session.scheduled_time
      ? session.scheduled_time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);

    return currentDate < sessionDate;
  }, [session]);

  // Status components
  const getStatusIcon = useCallback((status: Session["status"]) => {
    const config = STATUS_CONFIG[status];
    const IconComponent = config.icon;
    return <IconComponent className={`h-5 w-5 ${config.iconColor}`} />;
  }, []);

  const getStatusColor = useCallback((status: Session["status"]) => {
    return STATUS_CONFIG[status].color;
  }, []);

  // File handling
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const totalFiles = uploadedFiles.length + newFiles.length;

      if (totalFiles > MAX_FILES) {
        toast.info(`Only ${MAX_FILES} files can be uploaded`);
        return;
      }

      const validFiles = newFiles.filter(validateFile);
      if (validFiles.length !== newFiles.length) return;

      setUploadedFiles((prev) => [...prev, ...validFiles]);
    },
    [uploadedFiles.length, validateFile]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);

      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));

      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    },
    [uploadedFiles]
  );

  const handleRemoveFileAsync = async (id: string) => {
    await removeFile(id);
  };

  const handleUploadDocuments = useCallback(async () => {
    if (!session || uploadedFiles.length === 0) return;

    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("documents", file));
    formData.append("session_id", session._id);

    setUploadProgress(0);

    try {
      await uploadDocuments({
        payload: formData,
        setProgress: setUploadProgress,
      });

      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error("Failed to upload documents", error);
    }
  }, [session, uploadedFiles, uploadDocuments]);

  // Action handlers
  const handleStartSession = useCallback(() => {
    if (session) {
      onStartSession?.(session);
      setShowStartConfirm(false);
      onClose();
    }
  }, [session, onStartSession, onClose]);

  const handleEndSession = useCallback(() => {
    if (session) {
      onEndSession?.(session._id);
      setShowEndConfirm(false);
      onClose();
    }
  }, [session, onEndSession, onClose]);

  const handleCancelSession = useCallback(() => {
    if (session) {
      onCancelSession?.(session._id);
      setShowCancelConfirm(false);
      onClose();
    }
  }, [session, onCancelSession, onClose]);

  const handleClose = useCallback(() => {
    if (!documentUploading) {
      onClose();
    }
  }, [documentUploading, onClose]);

  if (!isOpen || !session) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getStatusIcon(session.status)}
              <DialogTitle className="text-xl">Session Details</DialogTitle>
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
                  {session.type === "consultation"
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
                        src={session.userData.profile_image || ""}
                        alt={session.userData.name}
                        className="h-full w-full object-cover"
                      />
                      <AvatarFallback className="h-full w-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 rounded-full">
                        {session.userData.name
                          ?.substring(0, 2)
                          ?.toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.userData.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.userData.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.clientData.phone || "N/A"}
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
                      {formatDate(session.scheduled_date)},{" "}
                      {formatTime(session.scheduled_time)}
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
                      {formatDate(session.start_time)}
                    </p>
                  </div>
                )}

                {session.end_time && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ended At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session.end_time)}
                    </p>
                  </div>
                )}

                {session.client_joined_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client Joined At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session.scheduled_date)} at{" "}
                      {formatTime(session.scheduled_time)}
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
                {session.reason}
              </p>
            </div>

            {/* Upload Documents */}
            <div>
              {!sessionDocuments && (
                <>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Upload Documents
                  </h3>

                  <Input
                    type="file"
                    multiple
                    accept=".pdf, .doc, .docx, .jpg, .png, .jpeg"
                    placeholder="Upload Documents"
                    ref={fileInputRef}
                    disabled={uploadedFiles.length >= MAX_FILES}
                    onChange={handleFileInputChange}
                    className="mb-3 cursor-pointer"
                  />
                </>
              )}

              <div className="flex gap-3 flex-wrap">
                {sessionDocuments &&
                !fileRemoving &&
                sessionDocuments?.document.length > 0
                  ? sessionDocuments.document.map((file) => (
                      <SessionDocumentsPreview
                        key={file._id}
                        id={file._id || ""}
                        name={file.name}
                        type={file.type}
                        url={file.url}
                        onRemoveFile={handleRemoveFileAsync}
                      />
                    ))
                  : uploadedFiles.length > 0 &&
                    uploadedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      return (
                        <SessionDocumentsPreview
                          key={index}
                          id={index.toString()}
                          name={file.name}
                          onRemoveFile={handleRemoveFile}
                          type={file.type}
                          url={fileURL}
                        />
                      );
                    })}
              </div>

              {!sessionDocuments && uploadedFiles.length > 0 && (
                <Button
                  className="mt-5"
                  onClick={handleUploadDocuments}
                  disabled={documentUploading}
                >
                  Upload Files
                </Button>
              )}

              {documentUploading && (
                <div className="mt-3">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadProgress <= 100
                      ? `Uploading... ${uploadProgress}%`
                      : "Processing..."}
                  </p>
                </div>
              )}
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
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={documentUploading}
            >
              Close
            </Button>
            <div className="flex gap-3">
              {session.status === "upcoming" && (
                <>
                  {sessionStartable && (
                    <Button
                      onClick={() => setShowStartConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={documentUploading}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Session
                    </Button>
                  )}
                  {sessionCancelable && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowCancelConfirm(true)}
                      disabled={documentUploading}
                    >
                      Cancel Session
                    </Button>
                  )}
                </>
              )}

              {session.status === "ongoing" && (
                <Button
                  variant="destructive"
                  disabled={documentUploading}
                  onClick={() => setShowEndConfirm(true)}
                >
                  End Session
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialogs */}
      <AlertDialog open={showStartConfirm} onOpenChange={setShowStartConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Join Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you ready to join this session?
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
    </>
  );
}
