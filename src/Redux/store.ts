import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./Auth/Auth.Slice";

export const store = configureStore({
  reducer: {
    Auth: AuthReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
