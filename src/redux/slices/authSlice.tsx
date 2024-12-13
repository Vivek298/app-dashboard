import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../../../dashboard-ts-project/src/redux/store';

interface AuthState {
    user: null | object;
    error: null | string;
}

const initialState: AuthState = {
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        registerSuccess(state, action: PayloadAction<object>) {
            state.user = action.payload;
            state.error = null;
        },
        loginSuccess(state, action: PayloadAction<object>) {
            state.user = action.payload;
            state.error = null;
        },
        authFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});

export const { registerSuccess, loginSuccess, authFailure } = authSlice.actions;
export default authSlice.reducer;

// Async Thunks
export const registerUser = (data: object) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to register');
        const user = await response.json();
        dispatch(registerSuccess(user));
    } catch (error: any) {
        dispatch(authFailure(error.message));
    }
};

export const loginUser = (email: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetch(`http://localhost:3000/users?email=${email}`);
        const users = await response.json();
        if (users.length === 0) throw new Error('User not found');
        dispatch(loginSuccess(users[0]));
    } catch (error: any) {
        dispatch(authFailure(error.message));
    }
};
