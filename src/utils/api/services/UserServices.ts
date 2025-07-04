import axiosinstance from "@/utils/api/axios/axios.instance";
import persistStore from "redux-persist/es/persistStore";

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

export async function refreshTokenRequest() {
  try {
    const result = await axiosinstance.get("api/user/refresh");
    const newToken = result.data.token;
    const { store } = await import("@/store/redux/store");
    const { setToken } = await import("@/store/redux/auth/Auth.Slice");
    store.dispatch(setToken(newToken));
  } catch (error) {
    console.log("error:in refresh function ", error);
    const { store } = await import("@/store/redux/store");
    const { signOut } = await import("@/store/redux/auth/Auth.Slice");
    const { LogOut } = await import("@/store/redux/client/ClientSlice");
    store.dispatch(signOut());
    store.dispatch(LogOut());
    persistStore(store).purge();
  }
}
