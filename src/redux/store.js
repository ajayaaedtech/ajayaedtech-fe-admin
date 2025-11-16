import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import courseReducer from "./slices/courseSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    courses: courseReducer,
  },
});
