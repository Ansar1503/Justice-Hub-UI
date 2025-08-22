import { UserEnum } from "@/types/enums/user.enums";
import { VerificationStatus } from "@/types/types/LawyerTypes";
import { createSlice } from "@reduxjs/toolkit";

type AuthUserDataType = {
  user_id?: string;
  name: string;
  email: string;
  profile_image?: string;
  mobile?: string;
  password?: string;
  role?: UserEnum;
  is_verified: boolean;
  is_blocked: boolean;
  lawyer_verification_status?: VerificationStatus;
  lawyer_reject_reason?: string;
};

interface AuthState {
  user: AuthUserDataType | null;
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
    setProfileImage: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, profile_image: action.payload };
      }
    },
    setLawyerData: (
      state,
      action: {
        payload: {
          rejectReason?: string;
          verification_status?: VerificationStatus;
        };
      }
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          lawyer_reject_reason: action.payload.rejectReason,
          lawyer_verification_status: action.payload.verification_status,
        };
      }
    },
  },
});

export const { setUser, signOut, setToken, setProfileImage, setLawyerData } =
  authSlice.actions;
export default authSlice.reducer;
