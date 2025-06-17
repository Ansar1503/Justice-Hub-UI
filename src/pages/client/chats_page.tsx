"use client";

import { useState } from "react";
import { io } from "socket.io-client";
import ChatList from "@/components/users/chat/ChatList";
import Footer from "./layout/Footer";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Chat from "@/components/users/chat/chat";
import { store } from "@/store/redux/store";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: ChatMessage[];
}

const sampleChats: ChatConversation[] = [
  {
    id: "1",
    title: "Project Planning Discussion",
    lastMessage: "Let me help you create a project timeline...",
    timestamp: new Date("2024-01-15T10:30:00"),
    messages: [
      {
        id: "1-1",
        content: "I need help planning my new project",
        role: "user",
        timestamp: new Date("2024-01-15T10:25:00"),
      },
      {
        id: "1-2",
        content:
          "I'd be happy to help you plan your project! What type of project are you working on?",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:26:00"),
      },
      {
        id: "1-3",
        content: "It's a web application for task management",
        role: "user",
        timestamp: new Date("2024-01-15T10:28:00"),
      },
      {
        id: "1-4",
        content:
          "Let me help you create a project timeline. For a task management web app, I recommend breaking it down into these phases:\n\n1. Planning & Design (1-2 weeks)\n2. Backend Development (2-3 weeks)\n3. Frontend Development (2-3 weeks)\n4. Testing & Deployment (1 week)",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
    ],
  },
  {
    id: "2",
    title: "React Best Practices",
    lastMessage: "Always use useCallback for event handlers...",
    timestamp: new Date("2024-01-14T15:45:00"),
    messages: [
      {
        id: "2-1",
        content: "What are some React best practices I should follow?",
        role: "user",
        timestamp: new Date("2024-01-14T15:40:00"),
      },
      {
        id: "2-2",
        content:
          "Here are some key React best practices:\n\n1. Use functional components with hooks\n2. Keep components small and focused\n3. Use proper key props in lists\n4. Avoid inline functions in JSX\n5. Use useCallback for event handlers to prevent unnecessary re-renders",
        role: "assistant",
        timestamp: new Date("2024-01-14T15:45:00"),
      },
    ],
  },
  {
    id: "3",
    title: "Database Design Help",
    lastMessage: "For your e-commerce app, consider these tables...",
    timestamp: new Date("2024-01-13T09:20:00"),
    messages: [
      {
        id: "3-1",
        content:
          "I need help designing a database for an e-commerce application",
        role: "user",
        timestamp: new Date("2024-01-13T09:15:00"),
      },
      {
        id: "3-2",
        content:
          "For your e-commerce app, consider these main tables:\n\n- Users (customers, admins)\n- Products (with categories, inventory)\n- Orders (with order items)\n- Payments\n- Reviews\n- Shopping Cart\n\nWould you like me to detail the schema for any specific table?",
        role: "assistant",
        timestamp: new Date("2024-01-13T09:20:00"),
      },
    ],
  },
];

function ChatsPage() {
  const { token } = store.getState().Auth;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const socket = io(backendUrl || "http://localhost:8000", {
    auth: { token: `bearer ${token}` },
    extraHeaders: {
      authorization: `bearer ${token}`,
    },
    withCredentials: true,
    retries: 5,
  });

  socket.on("connect", () => {
    console.log("Connected!");
    socket.emit("message", "Hello from the client!");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
  });
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(
    sampleChats[0]
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF2F2] dark:bg-black">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1">
          <div className="w-80 border-r border-gray-200 dark:border-gray-700">
            <ChatList
              chats={sampleChats}
              selectedChat={selectedChat}
              onSelectChat={setSelectedChat}
            />
          </div>
          <div className="flex-1 p-4">
            <Chat
              conversation={selectedChat}
              onSendMessage={(message) => {
                if (selectedChat) {
                  const newMessage: ChatMessage = {
                    id: `${selectedChat.id}-${Date.now()}`,
                    content: message,
                    role: "user",
                    timestamp: new Date(),
                  };

                  const updatedChat = {
                    ...selectedChat,
                    messages: [...selectedChat.messages, newMessage],
                    lastMessage: message,
                    timestamp: new Date(),
                  };

                  setSelectedChat(updatedChat);
                }
              }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChatsPage;
