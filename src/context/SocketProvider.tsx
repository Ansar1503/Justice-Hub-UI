import { RootState } from "@/store/redux/store";
import { getSocket } from "@/utils/socket/socket";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

// context/SocketContext.tsx
export const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token } = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    if (!token) return;
    const s = getSocket(token);
    setSocket(s);

    return () => {
      s.off();
      s.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
