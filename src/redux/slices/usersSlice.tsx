import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../../../dashboard-ts-project/src/redux/store";

interface User {
  id: string;
  region: string;
  status: string;
}

interface UsersState {
  users: User[];
  regions: string[];
  activeCounts: number[];
  inactiveCounts: number[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  regions: [],
  activeCounts: [],
  inactiveCounts: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("http://localhost:3000/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return (await response.json()) as User[];
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;

        // Process data to compute active and inactive counts by region
        const regionMap = new Map<string, { active: number; inactive: number }>();
        action.payload.forEach((user) => {
          if (!regionMap.has(user.region)) {
            regionMap.set(user.region, { active: 0, inactive: 0 });
          }
          if (user.status === "active") {
            regionMap.get(user.region)!.active++;
          } else {
            regionMap.get(user.region)!.inactive++;
          }
        });

        // Extract processed data into state
        state.regions = Array.from(regionMap.keys());
        state.activeCounts = Array.from(regionMap.values()).map((val) => val.active);
        state.inactiveCounts = Array.from(regionMap.values()).map((val) => val.inactive);
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

// Selector to compute total active and inactive counts
export const selectUserStats = (state: RootState) => {
  return {
    active: state.users.activeCounts.reduce((sum, count) => sum + count, 0),
    inactive: state.users.inactiveCounts.reduce((sum, count) => sum + count, 0),
  };
};

export default usersSlice.reducer;
