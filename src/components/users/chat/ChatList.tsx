"use client";

import { Search, MessageSquare, User, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { AggregateChatSession } from "@/types/types/ChatType";
import { AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

interface ChatListProps {
  onlineUsers: Record<string, boolean> | null;
  sessions: AggregateChatSession[];
  selectedSession: AggregateChatSession | null;
  currentUserId: string;
  searchTerm: string;
  setSearch: (search: string) => void;
  onSelectSession: (session: AggregateChatSession) => void;
  unreadCounts?: Record<string, number>;
}

function ChatList({
  onlineUsers,
  sessions,
  searchTerm,
  setSearch,
  selectedSession,
  currentUserId,
  onSelectSession,
  unreadCounts = {},
}: ChatListProps) {
  const formatTime = (date?: Date) => {
    if (!date) return "N/A";
    const now = new Date();
    date = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - date?.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const checkSessionOver = (session: AggregateChatSession) => {
    if (!session) return false;
    const currentDate = new Date();
    const sessionDate = new Date(session?.sessionDetails?.scheduled_date);
    const scheduledTime = selectedSession?.sessionDetails?.scheduled_time;
    const [h, m] =
      scheduledTime && typeof scheduledTime === "string"
        ? scheduledTime.split(":").map(Number)
        : [0, 0];
    sessionDate.setHours(h, m, 0, 0);
    const sessionEnd = new Date(
      sessionDate.getTime() + session?.sessionDetails?.duration * 60000
    );
    return currentDate > sessionEnd;
  };
  const getSessionPartnerId = (session: AggregateChatSession) => {
    return session.participants?.lawyer_id === currentUserId
      ? session.participants?.client_id
      : session.participants?.lawyer_id;
  };

  // const getStatusColor = (status: ChatSession["status"]) => {
  //   switch (status) {
  //     case "active" :
  //       return "bg-green-500";
  //     case "closed":
  //       return "bg-gray-500";
  //     case "cancelled":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chat Sessions
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Session List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No sessions found" : "No chat sessions yet"}
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const unreadCount = unreadCounts[session?._id || ""] || 0;
              const partnerId = getSessionPartnerId(session);
              const isCurrentUserClient =
                session?.participants?.client_id === currentUserId;
              const mainAvatarSrc = isCurrentUserClient
                ? session?.lawyerData?.profile_image
                : session?.clientData?.profile_image;
              const mainAvatarName = isCurrentUserClient
                ? session?.lawyerData?.name
                : session?.clientData?.name;
              const secondaryAvatarSrc = isCurrentUserClient
                ? session?.clientData?.profile_image
                : session?.lawyerData?.profile_image;

              const secondaryAvatarName = isCurrentUserClient
                ? session?.clientData?.name
                : session?.lawyerData?.name;
              const isSessionOver = checkSessionOver(session);
              return (
                <div
                  key={session?._id}
                  onClick={() => !isSessionOver && onSelectSession(session)}
                  className={`w-full p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSession?._id === session?._id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                        ${
                          isSessionOver
                            ? "pointer-events-none line-through bg-red-300 dark:bg-red-950"
                            : ""
                        }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      {/* Main Avatar */}
                      <div className="relative">
                        <div
                          className={`rounded-full h-2 w-2 ${
                            !isSessionOver &&
                            onlineUsers &&
                            onlineUsers[partnerId]
                              ? " bg-green-500"
                              : "bg-slate-800"
                          } absolute top-0 right-1 z-10`}
                        />
                        <Avatar
                          className={`w-12 h-12 border-2 border-background shadow-md ${
                            isSessionOver && "opacity-50 blur-[1px]"
                          }`}
                        >
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
                        {/*   Addd Online logic here  */}

                        {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />

                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 border-2 border-background rounded-full" /> */}
                      </div>

                      {/* Secondary*/}
                      <div className="absolute -bottom-1 -right-1">
                        {/* <div
                          className={`rounded-full h-2 w-2 ${
                            !isSessionOver &&
                            onlineUsers &&
                            onlineUsers[currentUserId]
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

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate text-gray-900 dark:text-white">
                          {session?.name || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <Badge
                              variant="destructive"
                              className="text-xs min-w-[20px] h-5 flex items-center justify-center"
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTime(session?.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 flex-1">
                          {session?.lastMessage?.content || "No messages yet"}
                        </p>
                        {/* <Badge
                          variant="outline"
                          className={`text-xs ml-2 ${
                            session.sessionDetails?.status === "upcoming"
                              ? "border-green-500 text-green-700"
                              : session.status === "closed"
                              ? "border-gray-500 text-gray-700"
                              : "border-red-500 text-red-700"
                          }`}
                        >
                          {session.sessionDetails?.status}
                        </Badge> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default React.memo(ChatList);
