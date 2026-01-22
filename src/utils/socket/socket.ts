import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000", {
      auth: { token: `bearer ${token}` },
      withCredentials: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      autoConnect: false,
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
