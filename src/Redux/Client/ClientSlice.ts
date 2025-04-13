import { clientDataType } from "@/types/types/Client.data.type";
import { createSlice } from "@reduxjs/toolkit";
import { fetchClientData, updateBasicInfo } from "./Client.thunk";

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
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchClientData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchClientData.fulfilled, (state, action) => {
      state.loading = false;
      console.log("action in clienslice fetch data", action);
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
    builder.addCase(updateBasicInfo.fulfilled,(state,action)=>{
      console.log('action when thunk updatebasicinfo',action)
    })
  },
});

export default clientSlice.reducer;
