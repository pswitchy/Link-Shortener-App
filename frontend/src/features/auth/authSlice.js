import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';
import { resetLinksState } from '../links/linksSlice';

// Load user info from localStorage
const storedUserInfo = localStorage.getItem('userInfo');
const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

const initialState = {
  userInfo: userInfo,
  loading: false,
  error: null,
};

// Async Thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data)); // Save user info
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data)); // Save user info on register too
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        localStorage.removeItem('userInfo');
        dispatch(resetLinksState()); // Reset links state on logout
        return null;
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional: Simple reducer to clear errors if needed
     clearAuthError: (state) => {
         state.error = null;
     }
  },
  extraReducers: (builder) => {
    builder
      // Login reducers (existing)
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userInfo = null;
      })
       // Register reducers (new)
      .addCase(register.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.userInfo = action.payload; // Log user in immediately after registration
          state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.userInfo = null;
      })
       // Logout reducers (existing)
      .addCase(logout.fulfilled, (state) => {
          state.userInfo = null;
          state.error = null;
          state.loading = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions; // Export if needed
export default authSlice.reducer;