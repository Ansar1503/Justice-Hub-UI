import axios, { AxiosInstance, AxiosError } from "axios";

const baseURL = import.meta.env.VITE_AXIOS_API_URL;


const axiosinstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    console.log("orignianlr request intercepter line 14", originalRequest);
    if (error.response?.status === 401) {
      try {
        await axiosinstance.post("/refresh");
      } catch (refresherror) {
        console.log(refresherror);
        window.location.href = "/login";
        return Promise.reject(refresherror);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;
