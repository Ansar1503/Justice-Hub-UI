import axiosinstance from "@/utils/api/axios/axios.instance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchClientData = createAsyncThunk(
  "client/fetchData",
  async (user_id: string, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(
        `/api/client/profile/${user_id}`
      );
      console.log(response);
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
