"use client";

import React, { useEffect } from "react";
import { useState, useRef } from "react";
import {
  Send,
  User,
  Paperclip,
  X,
  Scale,
  Trash2,
  Flag,
  Check,
} from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { AggregateChatSession, ChatMessage } from "@/types/types/ChatType";
import moment from "moment-timezone";
import { AvatarImage } from "@radix-ui/react-avatar";
import ChatDetailsModal from "./chatDetails.modal";

interface ChatProps {
  onlineUsers: Record<string, boolean> | null;
  selectedSession: AggregateChatSession | null;
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments?: File[]) => void;
  onInputMessage: () => void;
  currentUserId: string;
  isTyping?: boolean;
  onUpdateChatName?: (newName: string, chatId: string) => void;
  onDeleteMessage?: (messageId: string, sessionId: string) => void;
  onReportMessage?: (messageId: string, reason: string) => void;
  fetchNextPage?: () => void;
  fetchPreviousPage?: () => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFetchingNextPage?: boolean;
  isFetchingPreviousPage?: boolean;
}

function Chat({
  onlineUsers,
  fetchNextPage,
  // fetchPreviousPage,
  hasNextPage,
  // hasPreviousPage,
  isFetchingNextPage,
  // isFetchingPreviousPage,
  selectedSession,
  messages,
  onSendMessage,
  onInputMessage,
  currentUserId,
  isTyping,
  onUpdateChatName,
  onDeleteMessage,
  onReportMessage,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isChatDetailsOpen, setIsChatDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [reportReason, setReportReason] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);

  useEffect(() => {
    chatInputRef.current?.focus();
    setSelectedFiles([]);
    setNewMessage("");
    setIsChatDetailsOpen(false);
    setDeleteDialogOpen(false);
    setReportDialogOpen(false);
    setReportReason("");
  }, [selectedSession]);

  useEffect(() => {
    if (!scrollAreaRef.current) return;

    if (isInitialLoadRef.current && messages.length > 0) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      isInitialLoadRef.current = false;
    }
  }, [messages.length]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const isNearBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + 100;

      shouldScrollToBottomRef.current = isNearBottom;

      if (
        scrollContainer.scrollTop === 0 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        prevScrollHeightRef.current = scrollContainer.scrollHeight;
        fetchNextPage?.();
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    if (isTyping && shouldScrollToBottomRef.current) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [isTyping]);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer || isFetchingNextPage) return;

    const newScrollHeight = scrollContainer.scrollHeight;
    const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
    scrollContainer.scrollTop = scrollDiff;
  }, [messages.length]);

  const isCurrentUserClient =
    selectedSession?.participants?.client_id === currentUserId;

  const mainAvatarSrc = isCurrentUserClient
    ? selectedSession?.lawyerData?.profile_image
    : selectedSession?.clientData?.profile_image;

  const mainAvatarName = isCurrentUserClient
    ? selectedSession?.lawyerData?.name
    : selectedSession?.clientData?.name;

  const secondaryAvatarSrc = isCurrentUserClient
    ? selectedSession?.clientData?.profile_image
    : selectedSession?.lawyerData?.profile_image;

  const secondaryAvatarName = isCurrentUserClient
    ? selectedSession?.clientData?.name
    : selectedSession?.lawyerData?.name;

  function checkifTimeOut(date: Date, time: string) {
    const currentDate = new Date();
    const appointmentDate = new Date(date);
    const [h, m] = time.split(":").map(Number);
    appointmentDate.setHours(h, m, 0, 0);
    return currentDate > appointmentDate;
  }
  const getSessionPartnerId = (session: AggregateChatSession) => {
    return session.participants?.lawyer_id === currentUserId
      ? session.participants?.client_id
      : session.participants?.lawyer_id;
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedSession)
      return;

    const message = newMessage.trim();
    setNewMessage("");
    setSelectedFiles([]);
    onSendMessage(message, selectedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatMessageTime = (date: Date) => {
    return moment(date).tz("Asia/Kolkata").format("h:mm A");
  };

  const handleDeleteMessage = (messageId: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setTimeout(() => {
      setSelectedMessageId(messageId);
      setDeleteDialogOpen(true);
    }, 10);
  };

  const handleReportMessage = (messageId: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      setSelectedMessageId(messageId);
      setReportDialogOpen(true);
    }, 10);
  };

  const confirmDeleteMessage = () => {
    if (onDeleteMessage && selectedMessageId && selectedSession?._id) {
      onDeleteMessage(selectedMessageId, selectedSession._id);
    }
    setDeleteDialogOpen(false);
    setSelectedMessageId("");
  };

  const confirmReportMessage = () => {
    if (onReportMessage && selectedMessageId && reportReason.trim()) {
      onReportMessage(selectedMessageId, reportReason.trim());
    }
    setReportDialogOpen(false);
    setSelectedMessageId("");
    setReportReason("");
  };

  const renderAttachment = (
    attachment: { url: string; type: string },
    index: number
  ) => {
    if (!attachment?.url) return null;

    if (attachment.type.startsWith("image")) {
      return (
        <img
          key={index}
          src={attachment.url || "/placeholder.svg"}
          alt="Attachment"
          className="max-w-xs rounded-lg border"
        />
      );
    }

    return (
      <div
        key={index}
        className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
      >
        <Paperclip className="h-4 w-4" />
        <span className="text-sm truncate">
          {attachment.url.split("/").pop()}
        </span>
      </div>
    );
  };

  if (!selectedSession) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No chat session selected</h3>
          <p className="text-muted-foreground">
            Choose a session from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }
  const partnerId = getSessionPartnerId(selectedSession);
  return (
    <>
      <Card className="h-full flex flex-col min-h-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 ">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsChatDetailsOpen(true)}
            >
              {/* Main Avatar */}
              <div className="relative">
                <div
                  className={`rounded-full h-2 w-2 ${
                    onlineUsers && onlineUsers[partnerId]
                      ? " bg-green-500"
                      : "bg-slate-800"
                  } absolute top-0 right-1 z-10`}
                />
                <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                  <AvatarImage
                    src={mainAvatarSrc || "/placeholder.svg"}
                    alt={mainAvatarName || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {isCurrentUserClient ? (
                      <Scale className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Secondary Avatar*/}
              <div className="absolute -bottom-1 -right-1">
                {/* <div
                  className={`rounded-full h-2 w-2 ${
                    onlineUsers && onlineUsers[currentUserId]
                      ? " bg-green-500"
                      : "bg-slate-800"
                  } absolute top-0 right-1 z-10`}
                /> */}
                <Avatar className="w-7 h-7 border-2 border-background shadow-lg">
                  <AvatarImage
                    src={secondaryAvatarSrc || "/placeholder.svg"}
                    alt={secondaryAvatarName || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-700 text-white text-xs">
                    {isCurrentUserClient ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Scale className="h-3 w-3" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => setIsChatDetailsOpen(true)}
            >
              <span>{selectedSession?.name}</span>
              {/* <span className="text-sm font-normal text-muted-foreground">
                {messages.length} messages
              </span> */}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 h-full min-h-0">
          {/* Messages & Typing */}
          <div
            className="flex-1 overflow-y-auto p-4 scrollbar-hide"
            ref={scrollAreaRef}
          >
            <div className="flex flex-col space-y-4 min-h-full justify-end">
              <>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-[300px] text-center text-muted-foreground">
                    <div>
                      <h3 className="text-md font-semibold mb-1">
                        No messages yet
                      </h3>
                      <p className="text-sm">
                        Start the conversation by sending a message.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === currentUserId;
                    return (
                      <div
                        key={message._id}
                        className={`flex gap-3 ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                selectedSession?.participants?.client_id !==
                                currentUserId
                                  ? selectedSession?.clientData?.profile_image
                                  : selectedSession?.lawyerData?.profile_image
                              }
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] ${isOwn ? "order-1" : ""}`}
                        >
                          <div className="relative group">
                            <div
                              className={`rounded-lg p-3 ${
                                isOwn
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {message.content}
                              </p>
                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map(
                                      (attachment, index) =>
                                        renderAttachment(attachment, index)
                                    )}
                                  </div>
                                )}
                            </div>

                            {/* Message Actions Dropdown */}
                            <div
                              className={`absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                              <DropdownMenu
                                onOpenChange={(open) => {
                                  if (
                                    !open &&
                                    document.activeElement instanceof
                                      HTMLElement
                                  ) {
                                    document.activeElement.blur();
                                  }
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-2 w-2 p-0 hover:cursor-pointer`}
                                  >
                                    <IoIosArrowDown className="h-3 w-3 " />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align={isOwn ? "start" : "end"}
                                  className="absolute bottom-4 -left-24"
                                  style={{ position: "absolute" }}
                                >
                                  {isOwn ? (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteMessage(message?._id || "")
                                      }
                                      className="text-red-600 focus:text-red-600 cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Message
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleReportMessage(message?._id || "")
                                      }
                                      className="text-orange-600 focus:text-orange-600 cursor-pointer"
                                    >
                                      <Flag className="h-4 w-4 mr-2" />
                                      Report Message
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div
                            className={`flex items-center gap-2 mt-1 px-1 ${
                              isOwn ? "justify-end" : "justify-start"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground">
                              {formatMessageTime(
                                message?.createdAt || new Date()
                              )}
                            </p>
                            {isOwn && (
                              <Check
                                className={`w-4 h-4 ${
                                  message.read
                                    ? "text-blue-500"
                                    : "text-gray-400"
                                }`}
                              />
                            )}
                          </div>
                        </div>
                        {isOwn && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                selectedSession?.participants?.client_id ===
                                currentUserId
                                  ? selectedSession?.clientData?.profile_image
                                  : selectedSession?.lawyerData?.profile_image
                              }
                            />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage
                        src={
                          selectedSession?.participants?.client_id !==
                          currentUserId
                            ? selectedSession?.clientData?.profile_image
                            : selectedSession?.lawyerData?.profile_image
                        }
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>

          {/* Input and file preview */}
          <div className="border-t p-4">
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="text-xs truncate max-w-20">
                      {file.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  !["upcoming", "ongoing"].includes(
                    selectedSession?.sessionDetails?.status
                  )
                }
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                ref={chatInputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  onInputMessage();
                }}
                placeholder={
                  ["upcoming", "ongoing"].includes(
                    selectedSession?.sessionDetails?.status
                  )
                    ? "Type your message..."
                    : "This session is not active"
                }
                className="flex-1"
                disabled={
                  !["upcoming", "ongoing"].includes(
                    selectedSession?.sessionDetails?.status
                  )
                }
              />
              <Button
                type="submit"
                disabled={
                  (!newMessage.trim() && selectedFiles.length === 0) ||
                  (!["upcoming", "ongoing"].includes(
                    selectedSession?.sessionDetails?.status
                  ) &&
                    checkifTimeOut(
                      selectedSession?.sessionDetails?.scheduled_date,
                      selectedSession?.sessionDetails?.scheduled_time
                    ))
                }
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Delete Message Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMessage}
              className=" cursor-pointer bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Message Dialog */}
      <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Message</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for reporting this message. This will help
              us review the content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter reason for reporting..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReportMessage}
              disabled={!reportReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedSession && Object.keys(selectedSession).length > 0 && (
        <ChatDetailsModal
          onlineUsers={onlineUsers}
          onUpdateChatName={onUpdateChatName}
          isOpen={isChatDetailsOpen}
          onClose={() => setIsChatDetailsOpen(false)}
          selectedSession={selectedSession}
          messages={messages}
          currentUserId={currentUserId}
          onEndSession={() => {
            console.log("Ending session...");
            setIsChatDetailsOpen(false);
          }}
          onMuteSession={() => {
            console.log("Muting session...");
          }}
        />
      )}
    </>
  );
}

export default React.memo(Chat);
