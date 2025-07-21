import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";

export async function fetchCallLogs(payload: {
  limit: number;
  page: number;
  sessionId: string;
}) {
  const { token, user } = store.getState().Auth;
  const role = user?.role;
  if (!role) return;
  const response = await axiosinstance.get(
    `/api/${role}/call-logs?limit=${payload.limit}&page=${payload.page}&sessionId=${payload.sessionId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}
