import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "../features/layout/layoutSlice";
import globalreducer from "../features/global/globalSlice";
import authReducer from "../features/auth/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    global: globalreducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
