// src/redux/features/userStatsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the initial state
interface UserStatsState {
  userStats: { month: string; active: number; inactive: number }[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserStatsState = {
  userStats: [],
  loading: false,
  error: null,
};

// Create an async thunk to fetch user stats data
export const fetchUserStats = createAsyncThunk(
  "userStats/fetchUserStats",
  async () => {
    const response = await fetch("/api/userStats"); // replace with your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch user stats");
    }
    const data = await response.json();
    return data;
  }
);

// Create slice
const userStatsSlice = createSlice({
  name: "userStats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

// Export actions and reducer
export default userStatsSlice.reducer;
