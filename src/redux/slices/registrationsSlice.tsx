// src/redux/features/registrationsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
interface RegistrationState {
  registrations: number[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RegistrationState = {
  registrations: [],
  loading: false,
  error: null,
};

// Thunk to fetch registrations data from db.json
export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchRegistrations",
  async () => {
    const response = await axios.get("http://localhost:3000/registrations"); // Replace with your API endpoint or local JSON file
    return response.data;
  }
);

// Create the slice
const registrationsSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.registrations = action.payload;
        state.loading = false;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default registrationsSlice.reducer;
