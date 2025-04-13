import axios, { AxiosInstance, AxiosError } from "axios";

const baseURL = import.meta.env.VITE_AXIOS_API_URL;

const axiosinstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosinstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    console.log("orignianlr request intercepter line 14", originalRequest);
    if (error.response?.status === 401) {
      try {
        console.log("refres posting....");
        const result = await axiosinstance.get("api/user/refresh");
        console.log("refresh result", result);
        const newToken = result.data.token;
        if (originalRequest && originalRequest.headers) {
          console.log("new token :", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          console.log("og req:", originalRequest);
          const { store } = await import("@/Redux/store");
          const { setToken } = await import("@/Redux/Auth/Auth.Slice");
          store.dispatch(setToken(newToken));
          // store.dispatch(setToken(result.data.token));
          return axiosinstance(originalRequest);
        }
      } catch (refresherror) {
        console.log(refresherror);
        const { store } = await import("@/Redux/store");
        const { signOut } = await import("@/Redux/Auth/Auth.Slice");
        store.dispatch(signOut());
        return Promise.reject(refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;
