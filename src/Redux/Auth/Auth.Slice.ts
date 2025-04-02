import { clientDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: clientDataType | null;
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
