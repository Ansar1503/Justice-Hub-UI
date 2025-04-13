import axiosinstance from "@/utils/api/axios/axios.instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const fetchClientData = createAsyncThunk(
  "client/fetchData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.Auth.token;
      const response = await axiosinstance.get(
        `/api/client/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );
      console.log('fetch thunk result',response)
      return { ...response.data?.data };
    } catch (error: any) {
      console.log('fetch error',error)
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

export const updateBasicInfo = createAsyncThunk(
  "client/updateBasicInfo",
  async (basicInfo: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state?.Auth.token;
      const response = await axiosinstance.put(
        "/api/client/profile/basic/",
        basicInfo,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );
      return { ...response.data };
    } catch (error: any) {
      console.log('error in thunk update',error)
      if (error.code === "ERR_NETWORK") {
        return rejectWithValue(error?.message || "update failed");
      } else if (error.response) {
        if (error.response.data) {
          return rejectWithValue(
            error.response?.data?.message || "update failed"
          );
        }
      }
    }
  }
);
