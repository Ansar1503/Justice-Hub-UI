import axiosinstance from "@/utils/api/axios/axios.instance";

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await axiosinstance.post("/api/user/login", credentials);
  return response.data;
}

export async function googlesignup(payload: {
  code: string;
  role: "lawyer" | "client";
}) {
  const response = await axiosinstance.post("/api/user/google/signup", payload);
  return response.data;
}
