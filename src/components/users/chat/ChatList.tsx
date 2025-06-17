"use client";

import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatConversation } from "@/pages/client/chats_page";
import { useState } from "react";

interface ChatListProps {
  chats: ChatConversation[];
  selectedChat: ChatConversation | null;
  onSelectChat: (chat: ChatConversation) => void;
}

export default function ChatList({
  chats,
  selectedChat,
  onSelectChat,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chats
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedChat?.id === chat.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-2 w-full mb-2">
                <MessageSquare className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-sm truncate flex-1 text-gray-900 dark:text-white">
                  {chat.title}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(chat.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 pl-6">
                {chat.lastMessage}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
