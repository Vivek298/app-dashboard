// Redux slice for fetching user registration trends
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../../dashboard-ts-project/src/redux/store";

interface RegistrationTrend {
  months: string[];
  registrations: number[];
}

interface TrendState {
  trend: RegistrationTrend | null;
  loading: boolean;
  error: string | null;
}

const initialState: TrendState = {
  trend: null,
  loading: false,
  error: null,
};

export const fetchUserRegistrationTrend = createAsyncThunk(
  "trend/fetchUserRegistrationTrend",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:3000/userRegistrationTrend"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return (await response.json()) as RegistrationTrend;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const trendSlice = createSlice({
  name: "trend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRegistrationTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRegistrationTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.trend = action.payload;
      })
      .addCase(fetchUserRegistrationTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectUserRegistrationTrend = (state: RootState) => state.trend;

export default trendSlice.reducer;