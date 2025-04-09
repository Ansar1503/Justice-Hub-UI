import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosinstance from "@/utils/api/axios/axios.instance";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    postData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosinstance.post(`/api/user/login`, postData);
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        return rejectWithValue(error?.message || "Login failed");
      } else if (error.response) {
        if (error.response.data) {
          return rejectWithValue(
            error.response?.data?.message || "Login failed"
          );
        }
      }
    }
  }
);


