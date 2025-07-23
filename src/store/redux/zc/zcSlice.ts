import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ZCState {
  roomId: string;
  token: string;
  AppId: number;
}

const initialState: ZCState = {
  token: "",
  AppId: 0,
  roomId: "",
};

const zcSlice = createSlice({
  initialState,
  name: "zc",
  reducers: {
    setZcState: (
      state,
      action: PayloadAction<{ token: string; AppId: number; roomId: string }>
    ) => {
      state.token = action.payload?.token;
      state.AppId = action.payload?.AppId;
      state.roomId = action.payload?.roomId;
    },

    resetZcState: () => initialState,
  },
});

export const { setZcState, resetZcState } = zcSlice.actions;
export default zcSlice.reducer;
