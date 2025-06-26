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
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useDocumentUpdateMutation } from "@/store/tanstack/mutations/DocumentMutation";
import { Progress } from "@radix-ui/react-progress";
import { useFetchSessionDocuments } from "@/store/tanstack/queries";

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sessionDocumentsData } = useFetchSessionDocuments(session?._id);
  const sessionDocuments = sessionDocumentsData?.data;
  const { mutateAsync: uploadDocuments, isPending: documentUploading } =
    useDocumentUpdateMutation();

  if (!isOpen || !session) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // input files
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles([]);
    const newFiles = Array.from(e.target.files || []);
    const totalFiles = uploadedFiles.length + newFiles.length;
    if (totalFiles > 3) {
      toast.info("Only 3 files can be uploaded");
      return;
    }
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    for (const file of newFiles) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const isAllowedType =
        allowedTypes.includes(fileType) ||
        fileName.endsWith(".doc") ||
        fileName.endsWith(".docx");

      if (file.size > 10 * 1024 * 1024) {
        toast.info("File size should be less than 5MB");
        return;
      }
      if (!isAllowedType) {
        toast.info("Only PDF, DOC, DOCX, JPG, PNG, JPEG files are allowed");
        return;
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  // remove file from state
  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);

    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "";
    const [hourStr, minute] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // handle file uploads
  const handleUploadDocuments = async () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("documents", file));
    formData.append("session_id", session?._id);
    setUploadProgress(0);
    await uploadDocuments({
      payload: formData,
      setProgress: setUploadProgress,
    });
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // checks if session is startable
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

  // check if session is cancelable
  const sessionCancelable = () => {
    const currentDate = new Date();
    const sessionDate = new Date(session?.scheduled_date);
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
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          if (!documentUploading) onClose();
        }}
      >
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
                        src={session?.clientData?.profile_image || ""}
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
                      {formatDate(session?.scheduled_date)},
                      {formatTime(session?.scheduled_time)}
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
                      {formatDate(session?.start_time)}
                    </p>
                  </div>
                )}

                {session.end_time && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ended At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session?.end_time)}
                    </p>
                  </div>
                )}

                {session.client_joined_at && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Client Joined At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(session?.scheduled_date)} at{" "}
                      {formatTime(session?.scheduled_time)}
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

            {/* Upload Documents */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Documents
              </h3>

              <Input
                type="file"
                multiple
                maxLength={3}
                accept=".pdf, .doc, .docx, .jpg, .png, .jpeg"
                placeholder="Upload Documents"
                ref={fileInputRef}
                disabled={uploadedFiles.length > 3}
                onChange={handleFileInputChange}
                className="mb-3 cursor-pointer"
              />

              <div className="flex gap-3">
                {uploadedFiles.map((file, index) => {
                  const fileURL = URL.createObjectURL(file);
                  const fileType = file.type;

                  return (
                    <div
                      key={index}
                      className="flex flex-col bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg max-w-xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 p-0 h-4 w-4"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      {/* preview */}
                      {fileType.startsWith("image/") ? (
                        <div
                          onClick={() => window.open(fileURL, "_blank")}
                          className="cursor-pointer"
                        >
                          <img
                            src={fileURL}
                            alt="Preview"
                            className="rounded w-full max-h-40 object-cover"
                          />
                        </div>
                      ) : fileType === "application/pdf" ? (
                        <div
                          onClick={() => window.open(fileURL, "_blank")}
                          className="cursor-pointer"
                        >
                          <iframe
                            src={fileURL}
                            className="w-full h-40 rounded border pointer-events-none"
                            title="PDF Preview"
                          />
                        </div>
                      ) : file.name.endsWith(".doc") ||
                        file.name.endsWith(".docx") ? (
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline text-xs mt-1"
                        >
                          Open {file.name}
                        </a>
                      ) : (
                        <a
                          href={fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline text-xs mt-1"
                        >
                          Open document
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                className="mt-5 "
                onClick={handleUploadDocuments}
                disabled={
                  uploadedFiles.length === 0 ||
                  !sessionCancelable() ||
                  documentUploading
                }
              >
                Upload Files
              </Button>
              {documentUploading && (
                <div className="mt-3">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadProgress <= 100
                      ? ` Uploading... ${uploadProgress}%`
                      : `processing...`}
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
              onClick={onClose}
              disabled={documentUploading}
            >
              Close
            </Button>
            <div className="flex gap-3">
              {session?.status === "upcoming" && (
                <>
                  {sessionStartable() && (
                    <Button
                      onClick={() => setShowStartConfirm(true)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={documentUploading}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  )}
                  {sessionCancelable() && (
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

              {session?.status === "ongoing" && (
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
