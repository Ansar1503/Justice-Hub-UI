"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatDisputesData } from "@/types/types/Disputes";

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
            <h3 className="font-medium">Reported Message</h3>
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
            <p className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {dispute.reason || "No reason provided"}
            </p>
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
      </DialogContent>
    </Dialog>
  );
}
