// import { store } from "@/Redux/store";
import axios, { AxiosInstance, AxiosError } from "axios";
import persistStore from "redux-persist/es/persistStore";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const axiosinstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// const axiosTokenInstance:AxiosInstance = axios.create({baseURL,
//   withCredentials:true,
//   headers:{
//     Authorization:`Bearer ${token}`
//   }
// })

axiosinstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    // console.log("orignianlr request intercepter line 14", originalRequest);
    if (error.response?.status === 401) {
      try {
        // console.log("refres posting....");
        const result = await axiosinstance.get("api/user/refresh");
        // console.log("refresh result", result);
        const newToken = result.data;
        if (originalRequest && originalRequest.headers) {
          // console.log("new token :", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          // console.log("og req:", originalRequest);
          const { store } = await import("@/store/redux/store");
          const { setToken } = await import("@/store/redux/auth/Auth.Slice");
          store.dispatch(setToken(newToken));
          // store.dispatch(setToken(result.data.token));
          return axiosinstance(originalRequest);
        }
      } catch (refresherror) {
        // console.log("refreshErrir", refresherror);
        const { store } = await import("@/store/redux/store");
        const { signOut } = await import("@/store/redux/auth/Auth.Slice");
        // const { LogOut } = await import("@/store/redux/client/ClientSlice");
        store.dispatch(signOut());
        // store.dispatch(LogOut());
        persistStore(store).purge();
        return Promise.reject(refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;
