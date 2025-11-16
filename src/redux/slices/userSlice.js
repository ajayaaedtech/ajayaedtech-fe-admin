import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";  // FIXED PATH

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/api/admin/users?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    users: [],
    totalUsers: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.page = action.payload.page;
        state.totalUsers = action.payload.totalUsers;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load users";
      });
  },
});

export default userSlice.reducer;
