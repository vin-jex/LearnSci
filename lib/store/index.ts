// lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import igboReducer from "./slices/igboSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    igbo: igboReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
