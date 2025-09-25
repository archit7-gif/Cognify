

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  currentChatId: null,
  status: 'idle',
  error: null,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.items = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    addChat: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeChat: (state, action) => {
      state.items = state.items.filter(chat => chat._id !== action.payload);
      if (state.currentChatId === action.payload) {
        state.currentChatId = null;
      }
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const chat = state.items.find(chat => chat._id === chatId);
      if (chat) {
        chat.title = title;
      }
    },
    setChatsLoading: (state, action) => {
      state.status = action.payload ? 'loading' : 'idle';
    },
    setChatsError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const {
  setChats,
  addChat,
  removeChat,
  setCurrentChatId,
  updateChatTitle,
  setChatsLoading,
  setChatsError,
} = chatsSlice.actions;

export default chatsSlice.reducer;
