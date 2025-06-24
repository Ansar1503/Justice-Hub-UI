// utils/socket.ts

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000", {
      auth: { token: `bearer ${token}` },
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
