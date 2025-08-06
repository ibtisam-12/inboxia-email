import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    accessToken: null,
    refreshToken: null, // <-- Add this
  },
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken; // <-- Add this
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.userDetails = null;
      state.accessToken = null;
      state.refreshToken = null; // <-- Add this
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUser, logout, setLoading, setError, clearError } = userSlice.actions;
export default userSlice.reducer;