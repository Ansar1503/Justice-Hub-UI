import { SocketContext } from "@/context/SocketProvider";
import { useContext } from "react";

export const useSocket = () => useContext(SocketContext);
