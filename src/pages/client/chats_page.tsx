import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChatList from "@/components/users/chat/ChatList";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

import { store } from "@/store/redux/store";
import type { AggregateChatSession, ChatMessage } from "@/types/types/ChatType";
import Chat from "@/components/users/chat/chat";
import {
  useInfiniteFetchChatforClient,
  useInfiniteFetchMessages,
} from "@/store/tanstack/infiniteQuery";
import { useQueryClient } from "@tanstack/react-query";

import { disconnectSocket, getSocket } from "@/utils/socket/socket";
import { refreshTokenRequest } from "@/utils/api/services/UserServices";
import { toast } from "sonner";
import { SocketEvents } from "@/types/enums/socket";
import { NotificationType } from "@/types/types/Notification";
import { useParams } from "react-router-dom";

function ChatsPage() {
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] =
    useState<AggregateChatSession | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set(""));
  // const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  // const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const { id } = useParams();
  const { token, user } = store.getState().Auth;
  const currentUserId = user?.user_id || "";
  const queryClient = useQueryClient();

  const socket = useRef<Socket | null>(null);
  const selectedSessionRef = useRef<any>(null);

  useEffect(() => {
    selectedSessionRef.current = selectedSession;
    if (selectedSession) {
      const s = socket.current;
      if (!s) return;
      if (!s.connected) {
        s.connect();
      }
      s.emit(SocketEvents.JOIN_CHAT_EVENT, { sessionId: selectedSession._id });
      console.log("joint emitted");
      setUnreadCounts((prev) => ({
        ...prev,
        [selectedSession._id!]: 0,
      }));
    }
  }, [selectedSession]);

  // console.log("soccetcurtent", socket.current);
  const onConnect = () => {
    console.log("connected..");
    setIsConnected(true);
  };
  const onDisconnect = (data: any) => {
    console.log("disconnecting...", data);
    setIsConnected(false);
  };

  const {
    data: chatSessionData,
    // fetchNextPage: fetchNextChats,
    // hasNextPage: hasNextChats,
    // isLoading: isLoadingChats,
  } = useInfiniteFetchChatforClient(search);

  const {
    data: chatMessageData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasNextMessages,
    // isLoading: isLoadingMessages,
    fetchPreviousPage: fetchPreviousMessages,
    hasPreviousPage: hasPreviousMessages,
    isFetchingNextPage: isfetchingNextMessages,
    isFetchingPreviousPage: isFetchingPreviousMessages,
  } = useInfiniteFetchMessages(selectedSession?._id || "");
  // console.log("chatMessagesData", chatMessageData);
  const chatMessages =
    chatMessageData?.pages.flatMap((page) => page?.data) || [];
  const chatSessions = useMemo(() => {
    return chatSessionData?.pages.flatMap((page) => page?.data) || [];
  }, [chatSessionData]);

  useEffect(() => {
    if (!id || !chatSessions.length) return;
    const sessionToSelect = chatSessions.find((cs) => cs._id === id);
    if (sessionToSelect) {
      setSelectedSession(sessionToSelect);
    }
  }, [id, chatSessions]);
  // console.log("chatsessions", chatSessions);
  const handleInputMessage = useCallback(() => {
    if (!socket.current || !selectedSession) return;
    // console.log("typing...");
    if (!socket.current.connected) {
      socket.current.connect();
    }
    socket.current.emit(SocketEvents.TYPING_EVENT, {
      session_id: selectedSession._id,
      userId: currentUserId,
    });
  }, [socket, selectedSession, currentUserId]);
  async function handleChatNameUpdate(chatName: string, chatId: string) {
    if (!token) return;
    if (!socket.current) {
      return;
    }
    const isCurrentUserClient =
      selectedSessionRef.current?.participants?.client_id === currentUserId;
    const s = socket.current;
    if (!s.connected) {
      s.connect();
    }
    s.emit(
      SocketEvents.CHANGE_CHAT_NAME_EVENT,
      {
        chatName,
        chatId,
        userId: isCurrentUserClient
          ? selectedSessionRef.current?.participants?.lawyer_id
          : selectedSessionRef.current?.participants?.client_id,
      },
      (data: { success: boolean; updatedChat?: any; error?: string }) => {
        if (data?.success && data.updatedChat) {
          // console.log("data,dat", data);
          queryClient.setQueryData(
            ["client", "chatsessions", search],
            (oldData: any) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                  ...page,
                  data: page.data.map((session: any) =>
                    session._id === data?.updatedChat?._id
                      ? { ...session, name: data?.updatedChat?.name }
                      : session
                  ),
                })),
              };
            }
          );
          setSelectedSession((prev) =>
            prev && prev._id === data.updatedChat?._id
              ? { ...prev, name: data?.updatedChat?.name }
              : prev
          );
        } else {
          console.log("changename error", data.error);
        }
      }
    );
  }
  // console.log("socket ", socket.current);
  useEffect(() => {
    if (!socket.current || !socket.current.connected) {
      socket.current = getSocket(token);
    }
    const s = socket.current;
    if (!s) return;
    if (!s.connected) {
      s.connect();
    }
    console.log("events listening...");
    s.on(SocketEvents.CONNECTED_EVENT, onConnect);
    s.on(SocketEvents.DISCONNECT_EVENT, onDisconnect);
    s.on(SocketEvents.CONNECTED_ERROR, (err: any) => {
      console.log("Socket connection error:", err);
      if (err?.message == "Token expired") {
        refreshTokenRequest();
      }
    });
    s.on(SocketEvents.USER_ONLINE_EVENT, (data: { users: string[] }) => {
      setOnlineUsers(new Set(data.users));
    });
    s.on(
      SocketEvents.MESSAGE_DELETE_EVENT,
      (data: {
        lastMessage: ChatMessage | null;
        messageId: string;
        sessionId: string;
      }) => {
        queryClient.invalidateQueries({
          queryKey: ["user", "chatMessages"],
          exact: false,
        });
        queryClient.setQueryData(
          ["client", "chatsessions", search],
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData?.pages?.map((page: any) => {
                return {
                  ...page,
                  data: page.data?.map((session: any) => {
                    // console.log("sessiondi", session._id);
                    // console.log("lastmessage", data.lastMessage);
                    if (!data.lastMessage) {
                      return {
                        ...session,
                        lastMessage: null,
                      };
                    }
                    if (session._id === data.lastMessage?.session_id) {
                      // console.log("sessssion,", session);
                      // console.log("new sessio ndata", data);
                      return {
                        ...session,
                        lastMessage: data?.lastMessage,
                      };
                    }
                    return session;
                  }),
                };
              }),
            };
          }
        );
        setUnreadCounts((prev) => ({
          ...prev,
          [data?.messageId || ""]: 0,
        }));
      }
    );
    s.on(SocketEvents.SOCKET_ERROR_EVENT, (err: any) => {
      console.log("Socket error:", err);
      // toast.error(err?.message || "Socket error");
    });
    s.on(SocketEvents.ERROR, (err) => {
      console.log("Socket error:", err);
    });
    s.on(SocketEvents.CHANGE_CHAT_NAME_EVENT, (data: any) => {
      queryClient.setQueryData(
        ["client", "chatsessions", search],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((session: any) =>
                session._id === data._id
                  ? { ...session, name: data?.name }
                  : session
              ),
            })),
          };
        }
      );
      setSelectedSession((prev) =>
        prev && prev._id === data?._id ? { ...prev, name: data?.name } : prev
      );
    });
    s.on(SocketEvents.MESSAGE_RECEIVED_EVENT, (newMessage: ChatMessage) => {
      queryClient.setQueryData(
        ["user", "chatMessages", newMessage.session_id],
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

      queryClient.setQueryData(
        ["client", "chatsessions", search],
        (oldData: { pages: { data: any[] }[]; pageParams: number[] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              const updatedData = page.data.map((session) =>
                session._id === newMessage.session_id
                  ? {
                      ...session,
                      lastMessage: newMessage,
                      updatedAt: newMessage.createdAt,
                    }
                  : session
              );

              return {
                ...page,
                data: updatedData.sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                ),
              };
            }),
          };
        }
      );

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
        if (
          selectedSessionRef.current &&
          data.session_id === selectedSessionRef.current._id &&
          data.userId !== currentUserId
        ) {
          // console.log("itsworking typing set");
          // console.log("Typing ON");
          setIsTyping(true);

          setTimeout(() => {
            // console.log("Typing OFF");
            setIsTyping(false);
          }, 5000);
        }
      }
    );

    return () => {
      if (socket.current) {
        socket.current.off();
        socket.current.disconnect();
        socket.current = null;
      }
      disconnectSocket();
      console.log("Socket disconnected & cleaned up");
    };
  }, [token]);
  const handleSelectSession = (session: AggregateChatSession) => {
    // console.log("sessionselected", session);
    setSelectedSession(session);
    const s = socket.current;
    // console.log("s is here : ", s);
    if (!s) return;
    if (!s.connected) {
      s.connect();
    }
    s.emit(SocketEvents.JOIN_CHAT_EVENT, { sessionId: session._id });
    console.log("joint emitted");
    // s.emit(SocketEvents.GET_MESSAGES_EVENT, { session_id: session._id });
    setUnreadCounts((prev) => ({
      ...prev,
      [session._id!]: 0,
    }));
  };

  // console.log("isconnects", isConnected);
  const handleSendMessage = (
    content: string,
    document?: { name: string; type: string; url: string }
  ) => {
    if (!selectedSessionRef.current) return;
    if (!document && !content.trim()) return;
    const s = socket.current;
    if (!s) return;
    if (!s.connected) {
      s.connect();
    }
    const partnerId =
      selectedSessionRef.current.participants.lawyer_id === currentUserId
        ? selectedSessionRef.current.participants.client_id
        : selectedSessionRef.current.participants.lawyer_id;

    const newMessage: Omit<ChatMessage, "_id" | "createdAt" | "updatedAt"> = {
      session_id: selectedSessionRef.current._id!,
      senderId: currentUserId,
      receiverId: partnerId,
      content,
      read: false,
      active: true,
      attachments: !document ? [] : [document],
    };
    // console.log("send message", newMessage);
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
            ["user", "chatMessages", selectedSessionRef.current._id],
            (oldData: any) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                pages: oldData.pages.map((page: any, index: number) => {
                  if (index === oldData.pages.length - 1) {
                    return {
                      ...page,
                      data: [...page.data, response.savedMessage],
                    };
                  }
                  return page;
                }),
              };
            }
          );
          queryClient.setQueryData(
            ["client", "chatsessions", search],
            (oldData: { pages: { data: any[] }[]; pageParams: number[] }) => {
              if (!oldData) return oldData;

              const isCurrentSession =
                selectedSessionRef.current?._id === newMessage?.session_id;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  if (!page?.data) return page;

                  const updatedChat = page.data.find(
                    (chat) => chat._id === newMessage?.session_id
                  );
                  if (!updatedChat) return page;
                  const updatedChatWithMessage = {
                    ...updatedChat,
                    lastMessage: newMessage,
                    updatedAt: new Date().toISOString(),
                  };
                  if (!isCurrentSession) {
                    return {
                      ...page,
                      data: page.data.map((chat) =>
                        chat._id === newMessage.session_id
                          ? updatedChatWithMessage
                          : chat
                      ),
                    };
                  }
                  const remainingChats = page.data.filter(
                    (chat) => chat._id !== newMessage.session_id
                  );
                  return {
                    ...page,
                    data: [updatedChatWithMessage, ...remainingChats],
                  };
                }),
              };
            }
          );
        }
      }
    );
    const notificationData: Omit<NotificationType, "id"> = {
      isRead: false,
      message: newMessage.content,
      sessionId: newMessage?.session_id,
      recipientId: newMessage?.receiverId,
      senderId: newMessage.senderId,
      title: "New Message Received",
      type: "message",
    };
    s.emit(SocketEvents.NOTIFICATION_SEND, notificationData);
  };

  const handleDeleteMessage = async (messageId: string, sessionId: string) => {
    const s = socket.current;
    if (!s || !selectedSessionRef.current) return;
    if (!s.connected) {
      s.connect();
    }
    s.emit(SocketEvents.MESSAGE_DELETE_EVENT, { messageId, sessionId });
  };

  const handleReportMessage = async (messageId: string, reason: string) => {
    const s = socket.current;
    if (!s || !selectedSession) return;
    if (!s.connected) {
      s.connect();
    }
    // console.log("reason", reason);
    s.emit(
      SocketEvents.REPORT_MESSAGE,
      { messageId, reason, reportedBy: currentUserId },
      (response: {
        success: boolean;
        reportedMessage?: ChatMessage;
        error?: string;
      }) => {
        if (response.success) {
          toast.success("message reported successfully");
        } else {
          toast.error(response.error);
        }
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen min-w-max bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 overflow-scroll scrollbar-hide ">
          <div className="w-80 border-r border-gray-200 dark:border-gray-700">
            <ChatList
              onlineUsers={onlineUsers}
              searchTerm={search}
              setSearch={setSearch}
              sessions={chatSessions}
              selectedSession={selectedSession}
              onSelectSession={handleSelectSession}
              unreadCounts={unreadCounts}
              currentUserId={currentUserId}
            />
          </div>
          <div className="flex-1 flex flex-col h-[calc(100vh-64px-48px)] p-4">
            {isConnected && (
              <Chat
                onlineUsers={onlineUsers}
                fetchNextPage={fetchNextMessages}
                fetchPreviousPage={fetchPreviousMessages}
                hasNextPage={hasNextMessages}
                hasPreviousPage={hasPreviousMessages}
                isFetchingNextPage={isfetchingNextMessages}
                isFetchingPreviousPage={isFetchingPreviousMessages}
                onDeleteMessage={handleDeleteMessage}
                onReportMessage={handleReportMessage}
                onUpdateChatName={handleChatNameUpdate}
                selectedSession={selectedSession}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onInputMessage={handleInputMessage}
                currentUserId={currentUserId}
                isTyping={isTyping}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChatsPage;
