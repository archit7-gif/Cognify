

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
    setAuthLoading: (state, action) => {
      state.status = action.payload ? 'loading' : 'idle';
    },
  },
});

export const { setUser, clearUser, setAuthError, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
