import { clientDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";
import {
  changeEmail,
  fetchClientData,
  sendVerificationMail,
  updateBasicInfo,
} from "./Client.thunk";

interface ClentState {
  client: clientDataType | null;
  loading: Boolean;
  error: string | null;
}

const initialState: ClentState = {
  client: null,
  error: null,
  loading: false,
};

const clientSlice = createSlice({
  initialState,
  name: "client",
  reducers: {
    LogOut: (state) => {
      state.client = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchClientData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClientData.fulfilled, (state, action) => {
      state.loading = false;
      // console.log("action in clienslice fetch data", action);
      state.client = action.payload;
    });
    builder.addCase(fetchClientData.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === "string") {
        state.error = action.payload;
      } else {
        state.error = "client data fetch failed!";
      }
    });
    builder.addCase(updateBasicInfo.fulfilled, (state, action) => {
      state.loading = false;
      console.log("action when thunk updatebasicinfo", action);
    });
    builder.addCase(changeEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changeEmail.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(changeEmail.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(sendVerificationMail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendVerificationMail.fulfilled, (state) => {
      (state.loading = false), (state.error = null);
    });
    builder.addCase(sendVerificationMail.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === "string") {
        state.error = action.payload;
      }else{
        state.error = "email verification sent error"
      }
    });
  },
});

export const { LogOut } = clientSlice.actions;
export default clientSlice.reducer;
