import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './slices/emailSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    emails: emailReducer,
    user: userReducer,
  },
});

export default store;