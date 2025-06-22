"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatList from "@/components/users/chat/ChatList";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import { store } from "@/store/redux/store";
import type { ChatMessage, ChatSession } from "@/types/types/ChatType";
import Chat from "@/components/users/chat/chat";
import { useInfiniteFetchChatforClient } from "@/store/tanstack/infiniteQuery";

enum SocketEvents {
  CONNECTED_EVENT = "connected",
  CONNECTED_ERROR = "connect_error",
  ERROR = "error",
  DISCONNECT_EVENT = "disconnect",
  JOIN_CHAT_EVENT = "joinChat",
  TYPING_EVENT = "typing",
  STOP_TYPING_EVENT = "stopTyping",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  MESSAGE_DELETE_EVENT = "messageDeleted",
  GET_MESSAGES_EVENT = "getMessages",
  MESSAGES_RECEIVED_EVENT = "messagesReceived",
}

function ChatsPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const { token, user } = store.getState().Auth;
  const currentUserId = user?.user_id || "";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const socket = io(backendUrl || "http://localhost:8000", {
    auth: { token: `bearer ${token}` },
    withCredentials: true,
  });

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteFetchChatforClient(search);

  const chatSessions = data?.pages.flatMap((page) => page.data) ?? [];

  const sessions: any = [];
  console.log("sessions", chatSessions);
  // const { data: chatData } = useFetchChatsForClients();

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvents.CONNECTED_EVENT, onConnect);
    socket.on(SocketEvents.DISCONNECT_EVENT, onDisconnect);
    socket.on(SocketEvents.CONNECTED_ERROR, (err: any) => {
      console.log("Socket connection error:", err, err.statusCode);
    });
    socket.on(SocketEvents.ERROR, (err) => {
      console.log("Socket error:", err);
    });

    socket.on(
      SocketEvents.MESSAGE_RECEIVED_EVENT,
      (newMessage: ChatMessage) => {
        if (selectedSession && newMessage.session_id === selectedSession._id) {
          setSessionMessages((prev) => [...prev, newMessage]);
        }

        if (newMessage.senderId !== currentUserId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [newMessage.session_id]: (prev[newMessage.session_id] || 0) + 1,
          }));
        }
      }
    );

    // listening for message received
    socket.on(
      SocketEvents.MESSAGES_RECEIVED_EVENT,
      (data: { session_id: string; messages: ChatMessage[] }) => {
        if (selectedSession && data.session_id === selectedSession._id) {
          setSessionMessages(data.messages);
        }
      }
    );

    // listending for typing event
    socket.on(
      SocketEvents.TYPING_EVENT,
      (data: { session_id: string; userId: string }) => {
        if (
          selectedSession &&
          data.session_id === selectedSession._id &&
          data.userId !== currentUserId
        ) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }
    );

    return () => {
      socket.off(SocketEvents.CONNECTED_EVENT, onConnect);
      socket.off(SocketEvents.DISCONNECT_EVENT, onDisconnect);
      socket.off(SocketEvents.CONNECTED_ERROR);
      socket.off(SocketEvents.ERROR);
      socket.off(SocketEvents.MESSAGE_RECEIVED_EVENT);
      socket.off(SocketEvents.MESSAGES_RECEIVED_EVENT);
      socket.off(SocketEvents.TYPING_EVENT);
    };
  }, [socket, selectedSession, currentUserId]);

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    setSessionMessages([]); // Clear previous messages

    // Join the session room
    socket.emit(SocketEvents.JOIN_CHAT_EVENT, { sessionId: session._id });

    // Request messages for this session
    socket.emit(SocketEvents.GET_MESSAGES_EVENT, { session_id: session._id });

    // Clear unread count for this session
    if (session._id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [session._id!]: 0,
      }));
    }
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!selectedSession || !content.trim()) return;

    const partnerId =
      selectedSession.participants.lawyer_id === currentUserId
        ? selectedSession.participants.client_id
        : selectedSession.participants.lawyer_id;

    const newMessage: Omit<ChatMessage, "_id" | "createdAt" | "updatedAt"> = {
      session_id: selectedSession._id!,
      senderId: currentUserId,
      receiverId: partnerId,
      content,
      read: false,
      attachments: attachments
        ? attachments.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type,
          }))
        : undefined,
    };

    socket.emit("sendMessage", newMessage);

    const messageWithId: ChatMessage = {
      ...newMessage,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessionMessages((prev) => [...prev, messageWithId]);
  };

  const handleInputMessage = () => {
    if (!socket || !selectedSession) return;
    socket.emit(SocketEvents.TYPING_EVENT, {
      session_id: selectedSession._id,
      userId: currentUserId,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1 ">
        <Sidebar />
        <div className="flex flex-1 min-h-screen">
          <div className="w-80 border-r border-gray-200 dark:border-gray-700">
            <ChatList
              sessions={chatSessions}
              selectedSession={selectedSession}
              onSelectSession={handleSelectSession}
              unreadCounts={unreadCounts}
            />
          </div>
          <div className="flex-1 p-4">
            <Chat
              selectedSession={selectedSession}
              messages={sessionMessages}
              onSendMessage={handleSendMessage}
              onInputMessage={handleInputMessage}
              currentUserId={currentUserId}
              isTyping={isTyping}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChatsPage;
