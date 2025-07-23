import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";
import { CallLogs } from "@/types/types/callLogs";

export async function joinVideoSession(payload: { sessionId: string }) {
  const { user, token } = store.getState().Auth;
  const role = user?.role;
  const result = await axiosinstance.patch(
    `/api/${role}/profile/sessions/join`,
    {
      sessionId: payload.sessionId,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
}

export async function fetchCallLogs(payload: {
  sessionId: string;
  limit: number;
  page: number;
}): Promise<{
  data: CallLogs[] | [];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const { user, token } = store.getState().Auth;
  const role = user?.role;
  const result = await axiosinstance.get(
    `/api/${role}/profile/sessions/callLogs/${payload.sessionId}?limit=${payload.limit}&page=${payload.page}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
}
