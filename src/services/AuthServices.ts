import axiosinstance from "@/utils/api/axios/axios.instance";

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await axiosinstance.post("/api/user/login", credentials);
  return response.data;
}
