import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, userId: null }, // Initialize userId to null
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, userId } = action.payload;
            state.token = accessToken;
            state.userId = userId; // Store the userId in the state
        },
        logOut: (state, action) => {
            state.token = null;
            state.userId = null; // Reset userId when logging out
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
