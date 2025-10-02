// import { store } from "@/Redux/store";
import { store } from "@/store/redux/store";
import axios, { AxiosInstance, AxiosError } from "axios";
import persistStore from "redux-persist/es/persistStore";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const axiosinstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosinstance.interceptors.request.use((config) => {
  const { token } = store.getState().Auth;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosinstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        const result = await axiosinstance.get("api/user/refresh");
        const newToken = result.data;
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          const { store } = await import("@/store/redux/store");
          const { setToken } = await import("@/store/redux/auth/Auth.Slice");
          console.log("netoken", newToken);
          store.dispatch(setToken(newToken));
          return axiosinstance(originalRequest);
        }
      } catch (refresherror) {
        const { store } = await import("@/store/redux/store");
        const { signOut } = await import("@/store/redux/auth/Auth.Slice");
        store.dispatch(signOut());
        persistStore(store).purge();
        return Promise.reject(refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;
