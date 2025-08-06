import { createSlice } from '@reduxjs/toolkit';

const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    emails: [],
    loading: false,
    error: null,
    sendingEmail: false,
    sendEmailError: null,
    replyingToEmail: false,
    replyError: null,
  },
  reducers: {
    setEmails: (state, action) => {
      state.emails = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSendingEmail: (state, action) => {
      state.sendingEmail = action.payload;
    },
    setSendEmailError: (state, action) => {
      state.sendEmailError = action.payload;
      state.sendingEmail = false;
    },
    setReplyingToEmail: (state, action) => {
      state.replyingToEmail = action.payload;
    },
    setReplyError: (state, action) => {
      state.replyError = action.payload;
      state.replyingToEmail = false;
    },
    clearErrors: (state) => {
      state.error = null;
      state.sendEmailError = null;
      state.replyError = null;
    },
  },
});

export const {
  setEmails,
  setLoading,
  setError,
  setSendingEmail,
  setSendEmailError,
  setReplyingToEmail,
  setReplyError,
  clearErrors,
} = emailSlice.actions;

export default emailSlice.reducer;