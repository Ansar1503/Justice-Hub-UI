import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatDisputesData, Disputes } from "@/types/types/Disputes";
import { AlertTriangle, Flag, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlockUser } from "@/store/tanstack/mutations";
import toast from "react-hot-toast";
import { useUpdateDisputeStatus } from "@/store/tanstack/mutations/DisputesMutation";
import { useContext } from "react";
import { SocketContext } from "@/context/SocketProvider";
import { SocketEvents } from "@/pages/lawyer/ChatPage";

interface ChatDisputeDetailsModalProps {
  dispute: ChatDisputesData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChatDisputeDetailsModal({
  dispute,
  open,
  onOpenChange,
}: ChatDisputeDetailsModalProps) {
  const socket = useContext(SocketContext);
  const { mutateAsync: blockUser } = useBlockUser();
  const { mutateAsync: updateStatus } = useUpdateDisputeStatus();
  async function onDeleteMessage(
    messageId: string,
    sessionId: string,
    disputesId: string
  ) {
    console.log(dispute.chatMessage)
    if (!messageId) {
      toast.error("message id required");
      return;
    }
    if (!sessionId) {
      toast.error("session id required");
      return;
    }
    if (!disputesId) {
      toast.error("disputes id required");
      return;
    }
    if (!socket) {
      toast.error("socket not working");
      return;
    }
    socket.emit(SocketEvents.MESSAGE_DELETE_EVENT, { messageId, sessionId });
    await updateDisputeStatus("deleted", "resolved", disputesId);
  }
  async function onBlocUser(userId: string, disputesId: string) {
    if (!userId || !disputesId) {
      toast.error("user id required");
      return;
    }
    await blockUser({ status: true, user_id: userId });
    await updateDisputeStatus("blocked", "resolved", disputesId);
  }
  async function updateDisputeStatus(
    action: Disputes["resolveAction"],
    status: Disputes["status"],
    disputesId: string
  ) {
    if (!action || !status || !disputesId) {
      toast.error("action and status required");
      return;
    }
    await updateStatus({ action, status, disputesId });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chat Dispute Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dispute Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge
              variant={
                dispute.status === "resolved"
                  ? "default"
                  : dispute.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {dispute.status}
            </Badge>
          </div>

          {/* Reporter Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Reporter</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={dispute.reportedBy.profile_image || "/placeholder.svg"}
                  alt={dispute.reportedBy.name}
                />
                <AvatarFallback>
                  {dispute.reportedBy.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{dispute.reportedBy.name}</p>
                <p className="text-sm text-muted-foreground">
                  {dispute.reportedBy.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dispute.reportedBy.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Reported User Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Reported User</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Avatar>
                <AvatarImage
                  src={dispute.reportedUser.profile_image || "/placeholder.svg"}
                  alt={dispute.reportedUser.name}
                />
                <AvatarFallback>
                  {dispute.reportedUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{dispute.reportedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {dispute.reportedUser.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dispute.reportedUser.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Reported Message</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    dispute.status === "resolved" ||
                    dispute.status === "rejected"
                  }
                  onClick={() =>
                    onDeleteMessage(
                      dispute.chatMessage.id,
                      dispute.chatMessage.session_id,
                      dispute.id
                    )
                  }
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    dispute.status === "resolved" ||
                    dispute.status === "rejected"
                  }
                  onClick={() =>
                    onBlocUser(dispute.reportedUser.user_id, dispute.id)
                  }
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Block User
                </Button>
              </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm">
                {dispute.chatMessage.content || "No content"}
              </p>
              {dispute.chatMessage.attachments &&
                dispute.chatMessage.attachments.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    📎 {dispute.chatMessage.attachments.length} attachment(s)
                  </div>
                )}
            </div>
          </div>

          {/* Report Reason */}
          <div className="space-y-2">
            <h3 className="font-medium">Report Reason</h3>
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {dispute.reason || "No reason provided"}
              </p>
            </div>
          </div>
          {/* action took */}
          <div>
            <h3 className="font-medium mb-1">Action</h3>
            <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
              <Flag className="h-4 w-4" />
              <p className="text-sm">
                {dispute.resolveAction
                  ? dispute.resolveAction === "blocked"
                    ? dispute.reportedUser.name + " has been " + "blocked"
                    : "message deleted"
                  : "No action taken"}
              </p>
            </div>
          </div>
          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Reported At:</span>
              <p className="text-muted-foreground">
                {new Date(dispute.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="font-medium">Messaged Date:</span>
              <p className="text-muted-foreground">
                {new Date(dispute.chatMessage.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={
              dispute.status === "rejected" || dispute.status === "resolved"
            }
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
