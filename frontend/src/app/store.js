import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import linksReducer from '../features/links/linksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linksReducer,
  },
  // Middleware is automatically included by configureStore (e.g., thunk)
});