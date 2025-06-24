import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChatList from "@/components/users/chat/ChatList";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import { store } from "@/store/redux/store";
import type { ChatMessage, ChatSession } from "@/types/types/ChatType";
import Chat from "@/components/users/chat/chat";
import {
  useInfiniteFetchChatforClient,
  useInfiniteFetchMessages,
} from "@/store/tanstack/infiniteQuery";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const socket = useRef<Socket | null>(null);

  const onConnect = () => setIsConnected(true);
  const onDisconnect = () => setIsConnected(false);

  const {
    data: chatSessionData,
    fetchNextPage: fetchNextChats,
    hasNextPage: hasNextChats,
    isLoading: isLoadingChats,
  } = useInfiniteFetchChatforClient(search);

  const {
    data: chatMessageData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasNextMessages,
    isLoading: isLoadingMessages,
  } = useInfiniteFetchMessages(selectedSession?._id || "");
  const chatMessages =
    chatMessageData?.pages.flatMap((page) => page.data) || [];
  const chatSessions =
    chatSessionData?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    // console.log("userid:", currentUserId);
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
      // toast.error(err?.message || "Socket error");
    });
    s.on(SocketEvents.ERROR, (err) => {
      console.log("Socket error:", err);
    });

    s.on(SocketEvents.MESSAGE_RECEIVED_EVENT, (newMessage: ChatMessage) => {
      if (selectedSession && newMessage.session_id === selectedSession._id) {
        queryClient.setQueryData(
          ["user", "chatMessages", selectedSession._id],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any, index: number) => {
                if (index === oldData.pages.length - 1) {
                  return {
                    ...page,
                    data: [...page.data, newMessage],
                  };
                }
                return page;
              }),
            };
          }
        );
      }

      if (newMessage.senderId !== currentUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.session_id]: (prev[newMessage.session_id] || 0) + 1,
        }));
      }
    });


    s.on(
      SocketEvents.TYPING_EVENT,
      (data: { session_id: string; userId: string }) => {
        // console.log("someone is typing in chat", data);
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
    };
  }, [token, selectedSession, currentUserId]);

  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    setSessionMessages([]);

    const s = socket.current;
    // console.log("s:", s);
    if (!s) return;
    // console.log("s is here : ", s);
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

    s.emit(
      SocketEvents.SEND_MESSAGE_EVENT,
      newMessage,
      (response: {
        success: boolean;
        savedMessage?: ChatMessage;
        error?: string;
      }) => {
        if (response.success && response.savedMessage) {
          queryClient.setQueryData(
            ["user", "chatMessages", selectedSession._id],
            (oldData: any) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page: any, index: number) => {
                  if (index === oldData.pages.length - 1) {
                    const withoutTemp = page.data.filter(
                      (msg: ChatMessage) =>
                        !(
                          msg.content === newMessage.content &&
                          msg.senderId === newMessage.senderId
                        )
                    );
                    return {
                      ...page,
                      data: [...withoutTemp, response.savedMessage],
                    };
                  }
                  return page;
                }),
              };
            }
          );
        } else {
          toast.error("Message failed to send.");
          queryClient.setQueryData(
            ["user", "chatMessages", selectedSession._id],
            (oldData: any) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page: any, index: number) => {
                  if (index === oldData.pages.length - 1) {
                    return {
                      ...page,
                      data: page.data.filter(
                        (msg: ChatMessage) =>
                          !(
                            msg.content === newMessage.content &&
                            msg.senderId === newMessage.senderId
                          )
                      ),
                    };
                  }
                  return page;
                }),
              };
            }
          );
        }
      }
    );
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
              messages={chatMessages}
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
