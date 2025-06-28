import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send, User, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage } from "@/types/types/ChatType";
import moment from "moment-timezone";
import { AvatarImage } from "@radix-ui/react-avatar";

interface ChatProps {
  selectedSession: any | null;
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments?: File[]) => void;
  onInputMessage: () => void;
  currentUserId: string;
  isTyping?: boolean;
  // isConnected: boolean;
}

function Chat({
  // isConnected,
  selectedSession,
  messages,
  onSendMessage,
  onInputMessage,
  currentUserId,
  isTyping = false,
}: ChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function checkifTimeOut(date: Date, time: string) {
    const currentDate = new Date();
    const appointmentDate = new Date(date);
    const [h, m] = time.split(":").map(Number);
    appointmentDate.setHours(h, m, 0, 0);
    return currentDate > appointmentDate;
  }

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

  // const isFromCurrentUser = (message: ChatMessage) => {
  //   return message.senderId === currentUserId;
  // };

  function getPartnerName() {
    if (!selectedSession) return "Chat";
    const isCurrentUserLawyer =
      selectedSession.participants?.lawyer_id === currentUserId;
    return isCurrentUserLawyer
      ? `Client ${selectedSession?.clientData?.name}`
      : `Lawyer ${selectedSession?.lawyerData?.name}`;
  }

  const renderAttachment = (
    attachment: { url: string; type: string },
    index: number
  ) => {
    if (!attachment?.url) return null;
    if (attachment.type.startsWith("image")) {
      return (
        <img
          key={index}
          src={attachment.url}
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                selectedSession?.participants?.client_id !== currentUserId
                  ? selectedSession?.clientData?.profile_image
                  : selectedSession?.lawyerData?.profile_image
              }
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{getPartnerName()}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {messages.length} messages
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages + Typing */}
        <div
          className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
          ref={scrollAreaRef}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-center text-muted-foreground">
              <div>
                <h3 className="text-md font-semibold mb-1">No messages yet</h3>
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
                    <Avatar className="h-8 w-8">
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

                  <div className={`max-w-[70%] ${isOwn ? "order-1" : ""}`}>
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
                            {message.attachments.map((attachment, index) =>
                              renderAttachment(attachment, index)
                            )}
                          </div>
                        )}
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-1 px-1 ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">
                        {formatMessageTime(message?.createdAt || new Date())}
                      </p>
                      {isOwn && (
                        <div
                          className={`w-2 h-2 rounded-full ${
                            message.read ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {isOwn && (
                    <Avatar className="h-8 w-8">
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
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    selectedSession?.participants?.client_id === currentUserId
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
                  <span className="text-xs truncate max-w-20">{file.name}</span>
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
  );
}

export default Chat;
