import { store } from "@/Redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await axiosinstance.post("/api/user/login", credentials);
  return response.data;
}

export async function fetchUserByRole(role: "client" | "lawyer" | "all") {
  const { token } = store.getState().Auth;
  const response = await axiosinstance.get(`/api/user/?role=${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
