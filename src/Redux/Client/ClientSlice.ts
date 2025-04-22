import { clientDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";

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
});

export const { LogOut } = clientSlice.actions;
export default clientSlice.reducer;
