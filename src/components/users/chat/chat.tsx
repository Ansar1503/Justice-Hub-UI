"use client";

import React, { useEffect } from "react";
import { useState, useRef } from "react";
import {
  Send,
  User,
  Paperclip,
  Scale,
  Trash2,
  Flag,
  Check,
  // X,
  Download,
  Upload,
} from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ChatDocumentsPreview from "./ChatDocumentsPreview";
import { toast } from "sonner";
import { sendFiles } from "@/utils/api/services/Chat";

export type FileWithProgress = {
  id: string;
  file: File;
  progress: number;
  uploaded: boolean;
  error?: string;
  uploading?: boolean;
};
interface ChatProps {
  onlineUsers: Set<string>;
  selectedSession: AggregateChatSession | null;
  messages: ChatMessage[];
  onSendMessage: (
    message: string,
    attachments?: { name: string; type: string; url: string }
  ) => void;
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
  const [isChatDetailsOpen, setIsChatDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [reportReason, setReportReason] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);

  useEffect(() => {
    chatInputRef.current?.focus();
    setFiles([]);
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

  // typing
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    if (isTyping && shouldScrollToBottomRef.current) {
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
  }, [isTyping]);

  // scroll effect
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer || isFetchingNextPage) return;

    const newScrollHeight = scrollContainer.scrollHeight;
    const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
    scrollContainer.scrollTop = scrollDiff;
  }, [messages.length]);

  // client values {
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
  const checkSessionOver = (session: AggregateChatSession | null) => {
    // return true
    if (!session) return false;

    const currentDate = new Date();
    const sessionDate = new Date(session?.appointmentDetails?.date);

    const scheduledTime = session?.appointmentDetails?.time;
    const [h, m] = scheduledTime
      ? scheduledTime.split(":").map(Number)
      : [0, 0];

    sessionDate.setHours(h, m, 0, 0);

    const sessionEnd = new Date(
      sessionDate.getTime() + session?.appointmentDetails?.duration * 60000
    );

    return currentDate > sessionEnd;
  };
  const isSessionOver = checkSessionOver(selectedSession);
  // get session partner id
  const getSessionPartnerId = (session: AggregateChatSession) => {
    return session.participants?.lawyer_id === currentUserId
      ? session.participants?.client_id
      : session.participants?.lawyer_id;
  };

  // handle send message start
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && files.length === 0) || !selectedSession) return;

    const message = newMessage.trim();
    setNewMessage("");
    setFiles([]);
    onSendMessage(message);
  };
  // handle send message end

  // handle send files start
  async function handleSend(files: FileWithProgress[]) {
    if (!files || uploading || isSessionOver || !selectedSession) return;
    setUploading(true);

    const uploadPromises = files.map(async (fileWithProgress) => {
      // Set uploading state
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileWithProgress.id
            ? { ...file, uploading: true, error: undefined }
            : file
        )
      );

      function handleOnProgress(progress: number) {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id ? { ...file, progress } : file
          )
        );
      }

      try {
        const attachment = await sendFiles({
          file: fileWithProgress.file,
          sessionId: selectedSession?._id || "",
          onProgress: handleOnProgress,
        });
        setFiles((prevFiles) =>
          prevFiles.filter((files) => files.id !== fileWithProgress.id)
        );
        onSendMessage("", attachment);
      } catch (error) {
        console.log("Upload error:", error);
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileWithProgress.id
              ? {
                  ...file,
                  error: "failed",
                  uploading: false,
                  progress: 0,
                }
              : file
          )
        );
      }
    });

    await Promise.all(uploadPromises);
    setUploading(false);
  }

  // handle send files end
  const handleRetryUpload = async (fileId: string) => {
    if (!selectedSession || !fileId || isSessionOver) return;
    const fileToRetry = files.find((f) => f.id === fileId);
    if (!fileToRetry) return;

    await handleSend([fileToRetry]);
  };

  // file select handler start
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    if (!selectedSession || isSessionOver) return;
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      uploaded: false,
      id: `${file.name}-${Date.now()}`,
    }));
    const updatedFiles = [...files, ...newFiles];
    if (updatedFiles.length > 5) {
      toast.error("Max 5 files allowed");
      return;
    }
    setFiles(updatedFiles);
    setIsPreviewOpen(true);
  };

  // format message time start
  const formatMessageTime = (date: Date) => {
    return moment(date).tz("Asia/Kolkata").format("h:mm A");
  };
  // format message time end

  // handle delete message start
  const handleDeleteMessage = (messageId: string) => {
    if (!selectedSession || isSessionOver) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      setSelectedMessageId(messageId);
      setDeleteDialogOpen(true);
    }, 10);
  };
  // handle delete message end

  // handle report message start
  const handleReportMessage = (messageId: string) => {
    if (!selectedSession || isSessionOver) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      setSelectedMessageId(messageId);
      setReportDialogOpen(true);
    }, 10);
  };
  // handle report message end

  // confirm Delete message start
  const confirmDeleteMessage = () => {
    if (!selectedSession || isSessionOver) return;
    if (onDeleteMessage && selectedMessageId && selectedSession?._id) {
      onDeleteMessage(selectedMessageId, selectedSession._id);
    }
    setDeleteDialogOpen(false);
    setSelectedMessageId("");
  };
  // confirm Delete message end

  // confirm Report message start
  const confirmReportMessage = () => {
    if (!selectedSession || isSessionOver) return;
    if (onReportMessage && selectedMessageId && reportReason.trim()) {
      onReportMessage(selectedMessageId, reportReason.trim());
    }
    setReportDialogOpen(false);
    setSelectedMessageId("");
    setReportReason("");
  };
  // confirm Report message end

  // render attachment start
  const renderAttachment = (
    attachment: { url: string; type: string; name: string },
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
    // render attachment end
    return (
      <div
        key={index}
        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
        onClick={() => {
          if (!selectedSession || isSessionOver) return;
          window.open(attachment.url, "_blank");
        }}
      >
        <div className="relative inline-block">
          <Download className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm truncate">{attachment.name}</span>
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
                    onlineUsers && onlineUsers.has(partnerId)
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
                        key={message.id}
                        className={`flex gap-3   ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                        style={{ marginTop: "0" }}
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
                              className={`rounded-lg p-2 ${
                                isOwn
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div
                                    className={`${
                                      isOwn ? "bg-blue-600" : "bg-gray-900"
                                    } rounded-lg space-y-2`}
                                  >
                                    {message.attachments.map(
                                      (attachment, index) =>
                                        renderAttachment(attachment, index)
                                    )}
                                  </div>
                                )}
                              <div className="flex justify-between gap-4 items-center">
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                <div className="mt-1 flex gap-1 items-end">
                                  <p className="text-xs text-right text-muted-foreground">
                                    {formatMessageTime(
                                      message?.createdAt || new Date()
                                    )}
                                  </p>
                                  {isOwn && (
                                    <Check
                                      className={`w-4 h-4 ${
                                        message.read
                                          ? "text-white"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  )}
                                </div>
                              </div>
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
                                      onClick={() => {
                                        handleDeleteMessage(message?.id || "");
                                      }}
                                      className="text-red-600 focus:text-red-600 cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete Message
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleReportMessage(message?.id || "")
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
                          ></div>
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
                {/* File Upload Progress */}
                {files.length > 0 && (
                  <div className="flex gap-3 justify-end">
                    <div className="max-w-[80%] order-1">
                      <div className="space-y-3">
                        {files.map((fileWithProgress) => (
                          <div
                            key={fileWithProgress.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border"
                          >
                            <div className="flex-shrink-0">
                              {fileWithProgress.file.type.startsWith(
                                "image/"
                              ) ? (
                                <img
                                  src={
                                    URL.createObjectURL(
                                      fileWithProgress.file
                                    ) || "/placeholder.svg"
                                  }
                                  alt={fileWithProgress.file.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                  <Upload className="h-5 w-5" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium truncate">
                                  {fileWithProgress.file.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  {fileWithProgress.uploaded && (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )}
                                  {fileWithProgress.error && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleRetryUpload(fileWithProgress.id)
                                      }
                                      className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      Retry
                                    </Button>
                                  )}
                                  {/* <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setFiles(
                                        files.filter(
                                          (f) => f.id !== fileWithProgress.id
                                        )
                                      )
                                    }
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button> */}
                                </div>
                              </div>

                              {fileWithProgress.error ? (
                                <p className="text-xs text-red-500">
                                  {fileWithProgress.error}
                                </p>
                              ) : fileWithProgress.uploaded ? (
                                <p className="text-xs text-green-600">
                                  Upload complete
                                </p>
                              ) : fileWithProgress.uploading ? (
                                <div className="space-y-2">
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${fileWithProgress.progress}%`,
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {Math.round(fileWithProgress.progress)}%
                                    uploaded
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  Ready to upload
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1 justify-end">
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
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
                  </div>
                )}
              </>
            </div>
          </div>

          {/* Input and file preview */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                max={5}
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
                  ) || isSessionOver
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
                max={5}
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
                  ) || isSessionOver
                }
              />
              <Button
                type="submit"
                disabled={
                  (!newMessage.trim() && files.length === 0) ||
                  (!["upcoming", "ongoing"].includes(
                    selectedSession?.sessionDetails?.status
                  ) &&
                    checkifTimeOut(
                      new Date(selectedSession?.appointmentDetails?.date),
                      selectedSession?.appointmentDetails?.time
                    )) ||
                  isSessionOver
                }
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <ChatDocumentsPreview
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
        }}
        selectedFiles={files}
        onFilesChange={setFiles}
        onSend={handleSend}
      />

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
