import { store } from "@/Redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function fetchClientData() {
  const { token } = store.getState().Auth;

  const response = await axiosinstance.get(`/api/client/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
