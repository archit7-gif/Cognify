import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false, // CHANGE: Always start closed
  mobileView: window.innerWidth < 768,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setMobileView: (state, action) => {
      state.mobileView = action.payload;
      // REMOVE: The auto-open logic when leaving mobile view
      // if (!action.payload) {
      //   state.sidebarOpen = true;
      // }
    },
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setMobileView,
  setToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;

