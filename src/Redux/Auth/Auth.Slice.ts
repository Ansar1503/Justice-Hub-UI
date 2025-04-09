import { userDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./Auth.thunk";

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
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const { user, token } = action.payload;
          state.user = user;
          state.token = token;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload == "string") {
          state.error = action.payload;
        } else {
          state.error = "Login failed";
        }
      });
  },
});

export const { setUser, signOut } = authSlice.actions;
export default authSlice.reducer;
