import React, { useMemo, useState } from "react";
import {
  User,
  Calendar,
  Clock,
  // MessageCircle,
  Scale,
  X,
  //   Phone,
  Video,
  //   Settings,
  //   FileText,
  Users,
  Info,
  Edit3,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import moment from "moment-timezone";
import { Input } from "@/components/ui/input";
import { AggregateChatSession } from "@/types/types/ChatType";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ChatDetailsModalProps {
  onlineUsers: Set<string>;
  isOpen: boolean;
  onClose: () => void;
  selectedSession: AggregateChatSession;
  messages: any[];
  currentUserId: string;
  onEndSession?: () => void;
  onMuteSession?: () => void;
  // onViewProfile?: (userId: string) => void;
  onUpdateChatName?: (newName: string, chatId: string) => void;
}

function ChatDetailsModal({
  onlineUsers,
  isOpen,
  onClose,
  selectedSession,
  // messages,
  currentUserId,
  // onEndSession,
  //   onMuteSession,
  // onViewProfile,
  onUpdateChatName,
}: //   onUpdateChatName,
ChatDetailsModalProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedChatName, setEditedChatName] = useState(
    selectedSession?.name || "NO TTTLE"
  );
  const [chatNameError, setChatNameError] = useState("");

  const isCurrentUserClient =
    selectedSession?.participants?.client_id === currentUserId;
  const clientData = selectedSession?.clientData;
  const lawyerData = selectedSession?.lawyerData;
  const sessionDetails = selectedSession?.sessionDetails;
  const sessionStartable = useMemo(() => {
    if (!sessionDetails || sessionDetails?.status !== "ongoing") return false;
    console.log("not false");
    const currentDate = new Date();
    const sessionDate = new Date(sessionDetails.scheduled_date);
    const [h, m] = sessionDetails.scheduled_time
      ? sessionDetails.scheduled_time.split(":").map(Number)
      : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + sessionDetails?.duration * 60000
    );

    return (
      currentDate >= sessionDate &&
      currentDate < sessionEnd &&
      sessionDetails?.status === "ongoing"
    );
  }, [selectedSession]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500";
      case "ongoing":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Scheduled";
      case "ongoing":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (date: Date, time: string) => {
    const sessionDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    return moment(sessionDate)
      .tz("Asia/Kolkata")
      .format("MMM DD, YYYY at h:mm A");
  };

  const getSessionDuration = () => {
    if (
      sessionDetails?.status !== "ongoing" &&
      sessionDetails?.status !== "completed"
    )
      return null;

    const startTime = sessionDetails?.start_time
      ? new Date(sessionDetails.start_time)
      : null;
    const endTime = sessionDetails?.end_time
      ? new Date(sessionDetails.end_time)
      : new Date();

    if (!startTime) return null;

    const duration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    );
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };
  const getSessionPartnerId = (session: AggregateChatSession) => {
    return session.participants?.lawyer_id === currentUserId
      ? session.participants?.client_id
      : session.participants?.lawyer_id;
  };
  // const getMessageStats = () => {
  //   const totalMessages = messages.length;
  //   const clientMessages = messages.filter(
  //     (m) => m.senderId === selectedSession?.participants?.client_id
  //   ).length;
  //   const lawyerMessages = messages.filter(
  //     (m) => m.senderId === selectedSession?.participants?.lawyer_id
  //   ).length;
  //   const attachments = messages.reduce(
  //     (acc, m) => acc + (m.attachments?.length || 0),
  //     0
  //   );

  //   return { totalMessages, clientMessages, lawyerMessages, attachments };
  // };

  const handleSaveName = () => {
    if (editedChatName?.trim()?.length < 5) {
      setChatNameError("Chat name should be at least 5 characters");
    }
    if (selectedSession?._id) {
      onUpdateChatName?.(editedChatName, selectedSession._id);
    }
    setIsEditingName(false);
    setChatNameError("");
  };

  const handleCancelEdit = () => {
    setChatNameError("");
    setEditedChatName(selectedSession?.name || "NO TITLE");
    setIsEditingName(false);
  };

  // const stats = getMessageStats();
  const duration = getSessionDuration();
  const partnerId = getSessionPartnerId(selectedSession);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Chat Session Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 pt-0 space-y-6">
            {/* Session Header */}
            <div className="text-center space-y-4">
              {/* Dual Avatar */}
              <div className="relative mx-auto w-fit">
                <div className="relative">
                  <div
                    className={`rounded-full h-2 w-2 ${
                      onlineUsers && onlineUsers.has(partnerId)
                        ? " bg-green-500"
                        : "bg-slate-800"
                    } absolute top-0 right-1 z-10`}
                  />
                  <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                    <AvatarImage
                      src={
                        isCurrentUserClient
                          ? lawyerData?.profile_image || "/placeholder.svg"
                          : clientData?.profile_image || "/placeholder.svg"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {isCurrentUserClient ? (
                        <Scale className="h-8 w-8" />
                      ) : (
                        <User className="h-8 w-8" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="absolute -bottom-2 -right-2">
                  <Avatar className="w-12 h-12 border-4 border-background shadow-lg">
                    <AvatarImage
                      src={
                        isCurrentUserClient
                          ? clientData?.profile_image || "/placeholder.svg"
                          : lawyerData?.profile_image || "/placeholder.svg"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-700 text-white">
                      {isCurrentUserClient ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Scale className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div>
                {isEditingName ? (
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedChatName}
                        onChange={(e) => {
                          setEditedChatName(e.target.value);
                          if (e.target.value.trim().length < 5) {
                            setChatNameError(
                              "Chat name should be at least 5 characters"
                            );
                          } else {
                            setChatNameError("");
                          }
                        }}
                        className="text-center text-xl font-semibold h-auto p-2 border-none bg-transparent"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={!!chatNameError}
                          onClick={handleSaveName}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    {chatNameError && (
                      <span className="text-sm text-red-600">
                        {chatNameError}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <h2 className="text-xl font-semibold">{editedChatName}</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingName(true)}
                      className="opacity-60 hover:opacity-100"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {lawyerData?.name} & {clientData?.name}
                </p>
              </div>

              {/* Session Status */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    sessionDetails?.status
                  )}`}
                />
                <Badge variant="outline">
                  {getStatusText(sessionDetails?.status)}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Session Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Session Details
              </h3>

              <div className="space-y-3">
                {/* Scheduled Time */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Scheduled</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(
                        sessionDetails?.scheduled_date,
                        sessionDetails?.scheduled_time
                      )}
                    </div>
                  </div>
                </div>

                {/* Duration */}
                {duration && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Duration</div>
                      <div className="text-xs text-muted-foreground">
                        {duration}
                      </div>
                    </div>
                  </div>
                )}

                {/* Session ID */}
                {/* <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Session ID</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {selectedSession?.id || "N/A"}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <Separator />

            {/* Participants */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Participants
              </h3>

              <div className="space-y-3">
                {/* Lawyer */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={lawyerData?.profile_image || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      <Scale className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {lawyerData?.name}
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="text-xs text-muted-foreground">
                        Lawyer
                      </div>
                      {onlineUsers &&
                      onlineUsers.has(
                        selectedSession?.participants?.lawyer_id
                      ) ? (
                        <span className="text-xs text-green-600">online</span>
                      ) : (
                        <span className="text-xs text-gray-600">offline</span>
                      )}
                    </div>
                  </div>
                  {/* implement online or offline here. */}
                  {/* <div className="w-2 h-2 bg-green-500 rounded-full" /> */}
                </div>

                {/* Client */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg  hover:bg-muted/80 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={clientData?.profile_image || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {clientData?.name}
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="text-xs text-muted-foreground">
                        Client
                      </div>
                      {onlineUsers &&
                      onlineUsers.has(
                        selectedSession?.participants?.client_id
                      ) ? (
                        <span className="text-xs text-green-600">online</span>
                      ) : (
                        <span className="text-xs text-gray-600">offline</span>
                      )}
                    </div>
                  </div>
                  {/* Implement Is Online Here
                  <div className="w-2 h-2 bg-green-500 rounded-full" /> */}
                </div>
              </div>
            </div>

            <Separator />

            {/* Message Statistics */}
            {/* <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-lg font-semibold">
                    {stats.totalMessages}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Messages
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-lg font-semibold">
                    {stats.attachments}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Attachments
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-lg font-semibold">
                    {stats.lawyerMessages}
                  </div>
                  <div className="text-xs text-muted-foreground">Lawyer</div>
                </div>

                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-lg font-semibold">
                    {stats.clientMessages}
                  </div>
                  <div className="text-xs text-muted-foreground">Client</div>
                </div>
              </div>
            </div> */}

            {/* <Separator /> */}

            {/* Actions */}
            <div className="space-y-3">
              <div className="space-y-2">
                {sessionStartable && (
                  <>
                    <h3 className="font-semibold">Actions</h3>

                    {/* <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={onMuteSession}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Mute Notifications
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Start Voice Call
                    </Button> */}

                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Join Video Call
                    </Button>
                  </>
                )}

                {/* <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Chat
                </Button> */}

                {/* {sessionDetails?.status === "ended" && (
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={onEndSession}
                  >
                    <X className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                )} */}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
export default React.memo(ChatDetailsModal);
