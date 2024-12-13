import { configureStore } from "@reduxjs/toolkit";
import userStatsReducer from "./slices/userStatsSlice";
import usersReducer from "./slices/usersSlice"; // Adjust paths if necessary
import authReducer from "./slices/authSlice";   // Adjust paths if necessary
import trendReducer from "./slices/trendSlice"; // trendSlice reducer

// Configure store
const store = configureStore({
  reducer: {
    users: usersReducer,       // User management
    auth: authReducer,         // Authentication
    userStats: userStatsReducer, // User statistics
    trend: trendReducer,       // Line chart trends
  },
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
