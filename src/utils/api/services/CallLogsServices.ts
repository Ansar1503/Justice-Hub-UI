import { CalllogsRoute, CommonQueies } from "@/utils/constants/RouteConstants";
import axiosinstance from "../axios/axios.instance";
import { store } from "@/store/redux/store";

export const addCallLogs = async (payload: {
  sessionId: string;
  roomId: string;
}) => {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.post(
    `${CommonQueies.api}${user?.role}${CalllogsRoute.base}`,
    payload
  );
  return response.data;
};

export const endCallLogs = async (payload: {
  sessionId: string;
  roomId: string;
}) => {
  const { user } = store.getState().Auth;
  const response = await axiosinstance.put(
    `${CommonQueies.api}${user?.role}${CalllogsRoute.base}`,
    payload
  );
  return response.data;
};
