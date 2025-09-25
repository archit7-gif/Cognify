
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byChat: {},
  composing: '',
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.byChat[chatId] = {
        items: messages,
        status: 'idle',
        hasMore: false,
      };
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.byChat[chatId]) {
        state.byChat[chatId] = { items: [], status: 'idle', hasMore: false };
      }
      state.byChat[chatId].items.push(message);
    },
    prependMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.byChat[chatId]) {
        state.byChat[chatId] = { items: [], status: 'idle', hasMore: false };
      }
      state.byChat[chatId].items = [...messages, ...state.byChat[chatId].items];
    },
    clearMessages: (state, action) => {
      const chatId = action.payload;
      if (state.byChat[chatId]) {
        delete state.byChat[chatId];
      }
    },
    setComposing: (state, action) => {
      state.composing = action.payload;
    },
    setMessagesLoading: (state, action) => {
      const { chatId, loading } = action.payload;
      if (!state.byChat[chatId]) {
        state.byChat[chatId] = { items: [], status: 'idle', hasMore: false };
      }
      state.byChat[chatId].status = loading ? 'loading' : 'idle';
    },
  },
});

export const {
  setMessages,
  appendMessage,
  prependMessages,
  clearMessages,
  setComposing,
  setMessagesLoading,
} = messagesSlice.actions;

export default messagesSlice.reducer;
