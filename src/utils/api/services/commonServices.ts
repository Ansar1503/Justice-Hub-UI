import { store } from "@/store/redux/store";
import axiosinstance from "../axios/axios.instance";

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
