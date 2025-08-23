import { useAppDispatch } from "@/store/redux/Hook";
import { RootState } from "@/store/redux/store";
import { setZcState } from "@/store/redux/zc/zcSlice";
import { useJoinSession } from "@/store/tanstack/mutations/sessionMutation";
import { SocketEvents } from "@/types/enums/socket";
import { NotificationType } from "@/types/types/Notification";
import { refreshTokenRequest } from "@/utils/api/services/UserServices";
import { getSocket } from "@/utils/socket/socket";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

// context/SocketContext.tsx
export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.Auth);
  const { mutateAsync: JoinSessionMutation } = useJoinSession();
  useEffect(() => {
    if (!token) return;
    const s = getSocket(token);
    s.connect();
    setSocket(s);
    s.on(SocketEvents.CONNECTED_EVENT, () => {
      console.log("connected to socket");
    });
    s.on(SocketEvents.DISCONNECT_EVENT, () => {
      console.log("socket disconnected");
    });
    s.on(SocketEvents.CONNECTED_ERROR, (err: any) => {
      toast.error(err);

      console.log("Socket connection error:", err);
      if (err?.message == "Token expired") {
        refreshTokenRequest();
      }
      s.connect();
      s.once("connect", () => {
        console.log("reconnecting to socket");
      });
    });
    s.on(SocketEvents.NOTIFICATION_RECEIVED, (data: NotificationType) => {
      console.log("notificatio received", data);
      if (Notification.permission === "granted") {
        showNotification();
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            showNotification();
          } else if (permission === "denied") {
            toast.info("Please enable notifications in your browser settings.");
          }
        });
      } else {
        toast.info(
          "Notifications are blocked. Please allow them in your browser."
        );
      }

      function showNotification() {
        const notifi = new Notification(data?.title, {
          body: data.message,
        });
        notifi.onclick = async () => {
          window.focus();
          const result = await JoinSessionMutation({
            sessionId: data?.sessionId || "",
          });
          dispatch(
            setZcState({
              AppId: Number(result.zc.appId),
              roomId: String(result.room_id),
              token: result.zc.token,
            })
          );
          navigate(`/client/session/join/${data?.sessionId}`);
        };
      }
    });
    return () => {
      s.off();
      s.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
