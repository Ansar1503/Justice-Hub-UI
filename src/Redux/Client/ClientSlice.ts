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
  reducers: {},
  extraReducers(builder) {
    
  },
});
