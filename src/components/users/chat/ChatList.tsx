"use client";

import { Search, MessageSquare, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type {  ChatSession } from "@/types/types/ChatType";
import { AvatarImage } from "@radix-ui/react-avatar";

interface ChatListProps {
  sessions: any[];
  selectedSession: ChatSession | null;
  currentUserId: string;
  searchTerm: string;
  setSearch: (search: string) => void;
  onSelectSession: (session: ChatSession) => void;
  unreadCounts?: Record<string, number>;
  // isConnected:boolean
}

export default function ChatList({
  // isConnected,
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

  const getSessionPartnerId = (session: ChatSession) => {
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
              const unreadCount = unreadCounts[session._id || ""] || 0;
              const partnerId = getSessionPartnerId(session);
              return (
                <div
                  key={session._id}
                  onClick={() => onSelectSession(session)}
                  className={`w-full p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    selectedSession?._id === session._id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            session?.participants?.lawyer_id === partnerId
                              ? session?.lawyerData?.profile_image
                              : session?.clientData?.profile_image
                          }
                        />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      {/* <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          session?.sessionDetails?.status
                        )}`}
                      /> */}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate text-gray-900 dark:text-white">
                          {session?.participants?.lawyer_id === partnerId
                            ? session?.lawyerData?.name
                            : session?.clientData?.name || "Unknown"}
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
