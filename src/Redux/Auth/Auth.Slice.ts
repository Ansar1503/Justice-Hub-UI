import { userDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: userDataType | null;
  token: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  token: "",
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.token = "";
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, signOut, setToken } = authSlice.actions;
export default authSlice.reducer;
