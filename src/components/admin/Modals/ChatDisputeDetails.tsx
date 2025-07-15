"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangleIcon,
  MessageSquareIcon,
  FileIcon,
  ImageIcon,
  CheckIcon,
  XIcon,
  EyeOffIcon,
} from "lucide-react";
import Confirmation from "@/components/Confirmation";
import { ChatMessage, ChatSession } from "@/types/types/ChatType";
import { clientDataType, userDataType } from "@/types/types/Client.data.type";

interface ChatDisputeDetailsProps {
  dispute: ChatMessage & {
    chatSession: ChatSession & {
      clientData: userDataType & clientDataType;
      lawyerData: userDataType & clientDataType;
    };
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  //   onResolveDispute?: (
  //     disputeId: string,
  //     action: "dismiss" | "warn" | "suspend" | "delete"
  //   ) => void;
}

export default function ChatDisputeDetailsModal({
  dispute,
  trigger,
  open,
  onOpenChange,
}: //   onResolveDispute,
ChatDisputeDetailsProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  const [contextMessages, setContextMessages] = useState<{
    previousMessages: any[];
    nextMessages: any[];
  }>({ previousMessages: [], nextMessages: [] });
  const [loading, setLoading] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [resolveAction, setResolveAction] = useState<
    "dismiss" | "warn" | "suspend" | "delete"
  >("dismiss");

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };

  //   useEffect(() => {
  //     if ((open !== undefined ? open : isOpen) && dispute) {
  //     }
  //   }, [open, isOpen, dispute]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const getUserData = (senderId: string) => {
    return senderId === dispute.chatSession.participants.lawyer_id
      ? dispute.chatSession.lawyerData
      : dispute.chatSession.clientData;
  };

  const getUserRole = (senderId: string) => {
    return senderId === dispute.chatSession.participants.lawyer_id
      ? "Lawyer"
      : "Client";
  };

  const renderMessage = (message: any, isDisputed = false) => {
    const userData = getUserData(message.senderId);
    const userRole = getUserRole(message.senderId);
    const isLawyer =
      message.senderId === dispute.chatSession.participants.lawyer_id;

    return (
      <div
        key={message._id}
        className={`flex gap-3 p-3 rounded-lg ${
          isDisputed
            ? "bg-red-50 border-2 border-red-200 dark:bg-red-900/20 dark:border-red-800"
            : "bg-gray-50 dark:bg-gray-800"
        } ${isLawyer ? "ml-auto flex-row-reverse" : ""}`}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={userData?.profile_image || "/placeholder.svg"}
            alt={userData?.name}
          />
          <AvatarFallback>
            {getInitials(userData?.name || "Unknown")}
          </AvatarFallback>
        </Avatar>
        <div className={`flex-1 ${isLawyer ? "text-right" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{userData?.name}</span>
            <Badge variant="outline" className="text-xs">
              {userRole}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.createdAt)}
            </span>
            {isDisputed && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangleIcon className="h-3 w-3 mr-1" />
                Disputed
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-900 dark:text-white">
            {message.content}
          </p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs"
                >
                  {attachment.type.startsWith("image/") ? (
                    <ImageIcon className="h-3 w-3" />
                  ) : (
                    <FileIcon className="h-3 w-3" />
                  )}
                  <span>Attachment</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleResolveDispute = (
    action: "dismiss" | "warn" | "suspend" | "delete"
  ) => {
    setResolveAction(action);
    setShowResolveConfirm(true);
  };

  const confirmResolveDispute = () => {
    // onResolveDispute?.(dispute._id!, resolveAction);
    setShowResolveConfirm(false);
    handleOpenChange(false);
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "dismiss":
        return "dismiss this report";
      case "warn":
        return "warn the user";
      case "suspend":
        return "suspend the user";
      case "delete":
        return "delete the message";
      default:
        return "take this action";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "dismiss":
        return "bg-gray-600 hover:bg-gray-700";
      case "warn":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "suspend":
        return "bg-orange-600 hover:bg-orange-700";
      case "delete":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <>
      <Dialog
        open={open !== undefined ? open : isOpen}
        onOpenChange={handleOpenChange}
      >
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="h-5 w-5 text-red-500" />
              <DialogTitle className="text-xl">
                Chat Dispute Details
              </DialogTitle>
            </div>
            <DialogDescription>
              Review the reported message and surrounding context
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Dispute Information */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Reported by:
                  </span>
                  <p className="text-red-700 dark:text-red-300">
                    {getUserData(dispute.receiverId)?.name} (
                    {getUserRole(dispute.receiverId)})
                  </p>
                </div>
                <div>
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Reason:
                  </span>
                  <p className="text-red-700 dark:text-red-300">
                    {dispute.report?.reason || "No reason provided"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-red-800 dark:text-red-200">
                    Reported on:
                  </span>
                  <p className="text-red-700 dark:text-red-300">
                    {dispute.report?.reportedAt
                      ? formatDate(dispute.report.reportedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <MessageSquareIcon className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Session:</span>
                <span>{dispute.chatSession.name}</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                Conversation Context
              </h4>
              <ScrollArea className="h-96 pr-4">
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading context messages...
                    </div>
                  ) : (
                    <>
                      {/* Previous Messages */}
                      {contextMessages.previousMessages.map((message) =>
                        renderMessage(message)
                      )}

                      {/* Disputed Message */}
                      {renderMessage(dispute, true)}

                      {/* Next Messages */}
                      {contextMessages.nextMessages.map((message) =>
                        renderMessage(message)
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator />

          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => handleResolveDispute("dismiss")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Dismiss
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleResolveDispute("warn")}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              >
                {/* <AlertTriangleIcon className="h-4 w-4 mr-2" />
                Warn User
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleResolveDispute("suspend")}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800"
              > */}
                <EyeOffIcon className="h-4 w-4 mr-2" />
                Block User
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleResolveDispute("delete")}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Delete Message
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Confirmation
        setOpen={setShowResolveConfirm}
        open={showResolveConfirm}
        title="Confirm Action"
        description={`Are you sure you want to ${getActionLabel(
          resolveAction
        )}? This action may not be reversible.`}
        handleAction={confirmResolveDispute}
        actionText={`Yes, ${resolveAction}`}
        className={`${getActionColor(resolveAction)}`}
      />
    </>
  );
}
