import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import courseReducer from "./slices/courseSlice";
import adminStats from "./slices/adminStatsSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    courses: courseReducer,
    adminStats: adminStats,

  },
});
