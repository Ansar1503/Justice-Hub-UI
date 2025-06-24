import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChatList from "@/components/users/chat/ChatList";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import { store } from "@/store/redux/store";
import type { ChatMessage, ChatSession } from "@/types/types/ChatType";
import Chat from "@/components/users/chat/chat";
import { useInfiniteFetchChatforClient } from "@/store/tanstack/infiniteQuery";
import { toast } from "react-toastify";

import { getSocket, disconnectSocket } from "@/utils/socket/socket";

enum SocketEvents {
  CONNECTED_EVENT = "connected",
  CONNECTED_ERROR = "connect_error",
  ERROR = "error",
  SOCKET_ERROR_EVENT = "socketError",
  DISCONNECT_EVENT = "disconnect",
  JOIN_CHAT_EVENT = "joinChat",
  TYPING_EVENT = "typing",
  STOP_TYPING_EVENT = "stopTyping",
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  MESSAGE_DELETE_EVENT = "messageDeleted",
  GET_MESSAGES_EVENT = "getMessages",
  MESSAGES_RECEIVED_EVENT = "messagesReceived",
  SEND_MESSAGE_EVENT = "sendMessage",
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

  const socket = useRef<Socket | null>(null);

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteFetchChatforClient(search);

  const chatSessions = data?.pages.flatMap((page) => page.data) ?? [];

  const onConnect = () => setIsConnected(true);
  const onDisconnect = () => setIsConnected(false);

  useEffect(() => {
    // console.log("currentuserid", currentUserId);
    if (!token) return;
    if (!socket.current) {
      socket.current = getSocket(token);
    }
    const s = socket.current;
    if (!s) return;

    s.on(SocketEvents.CONNECTED_EVENT, onConnect);
    s.on(SocketEvents.DISCONNECT_EVENT, onDisconnect);
    s.on(SocketEvents.CONNECTED_ERROR, (err: any) => {
      console.log("Socket connection error:", err?.message);
    });
    s.on(SocketEvents.SOCKET_ERROR_EVENT, (err: any) => {
      console.log("Socket error:", err);
      toast.error(err?.message || "Socket error");
    });
    s.on(SocketEvents.ERROR, (err) => {
      console.log("Socket error:", err);
    });

    s.on(SocketEvents.MESSAGE_RECEIVED_EVENT, (newMessage: ChatMessage) => {
      if (selectedSession && newMessage.session_id === selectedSession._id) {
        setSessionMessages((prev) => [...prev, newMessage]);
      }

      if (newMessage.senderId !== currentUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.session_id]: (prev[newMessage.session_id] || 0) + 1,
        }));
      }
    });

    s.on(
      SocketEvents.MESSAGES_RECEIVED_EVENT,
      (data: { session_id: string; messages: ChatMessage[] }) => {
        if (selectedSession && data.session_id === selectedSession._id) {
          setSessionMessages(data.messages);
        }
      }
    );

    s.on(
      SocketEvents.TYPING_EVENT,
      (data: { session_id: string; userId: string }) => {
        // console.log("Received typing event:", data);
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
      s.off(SocketEvents.CONNECTED_EVENT, onConnect);
      s.off(SocketEvents.DISCONNECT_EVENT, onDisconnect);
      s.off(SocketEvents.CONNECTED_ERROR);
      s.off(SocketEvents.SOCKET_ERROR_EVENT);
      s.off(SocketEvents.ERROR);
      s.off(SocketEvents.MESSAGE_RECEIVED_EVENT);
      s.off(SocketEvents.MESSAGES_RECEIVED_EVENT);
      s.off(SocketEvents.TYPING_EVENT);
      // disconnectSocket();
    };
  }, [token, currentUserId, selectedSession]);

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    setSessionMessages([]);

    const s = socket.current;
    // console.log("s:", s);
    if (!s) return;

    s.emit(SocketEvents.JOIN_CHAT_EVENT, { sessionId: session._id });
    // s.emit(SocketEvents.GET_MESSAGES_EVENT, { session_id: session._id });

    setUnreadCounts((prev) => ({
      ...prev,
      [session._id!]: 0,
    }));
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (!selectedSession || !content.trim()) return;
    const s = socket.current;
    if (!s) return;
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
      attachments: attachments?.map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      })),
    };
    s.emit(SocketEvents.SEND_MESSAGE_EVENT, newMessage);
    s.on(SocketEvents.MESSAGES_RECEIVED_EVENT, (message: ChatMessage) => {
      console.log("message:", message);
    });
  };

  const handleInputMessage = () => {
    if (!socket.current || !selectedSession) return;
    socket.current.emit(SocketEvents.TYPING_EVENT, {
      session_id: selectedSession._id,
      userId: currentUserId,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 ">
          <div className="w-80 border-r border-gray-200 dark:border-gray-700">
            <ChatList
              sessions={chatSessions}
              selectedSession={selectedSession}
              onSelectSession={handleSelectSession}
              unreadCounts={unreadCounts}
              currentUserId={currentUserId}
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
