import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {COURSE_COUNT_URL} from "../../api/api"

// API Endpoint
// Thunk → fetch admin stats
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(COURSE_COUNT_URL);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching stats");
    }
  }
);
const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState: {
    totalUsers: 0,
    totalCourses: 0,
    totalEnrolledCourses: 0,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload.totalUsers;
        state.totalCourses = action.payload.totalCourses;
        state.totalEnrolledCourses = action.payload.totalEnrolledCourses;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminStatsSlice.reducer;
