import { signOut } from "@/store/redux/auth/Auth.Slice";
import { persistor, store } from "@/store/redux/store";
import axiosinstance from "@/utils/api/axios/axios.instance";

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  const response = await axiosinstance.post("/api/user/login", credentials);
  return response.data;
}

// export async function googlesignup(payload: {
//   code: string;
//   role: "lawyer" | "client";
// }) {
//   const response = await axiosinstance.post("/api/user/google/signup", payload);
//   return response.data;
// }

export async function refreshTokenRequest() {
  try {
    const result = await axiosinstance.get("api/user/refresh");
    const newToken = result.data.token;
    const { store } = await import("@/store/redux/store");
    const { setToken } = await import("@/store/redux/auth/Auth.Slice");
    store.dispatch(setToken(newToken));
  } catch (error) {
    console.log("error:in refresh function ", error);
    handleLogout();
  }
}
const handleLogout = async () => {
  // dispatch(LogOut());
  try {
    await axiosinstance.post("/api/user/logout");
  } catch (error) {
    console.log("logout error ", error);
  } finally {
    console.log("loggin out .....");
    store.dispatch(signOut());
    await persistor.purge();
  }
};
