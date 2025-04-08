import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

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

// Async Thunk for logout (simple state reset)
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        localStorage.removeItem('userInfo');
        // Optionally dispatch actions to clear other state (like links)
        // dispatch(resetLinksState()); // You'd need to define this in linksSlice
        return null; // Return null or any indicator of successful logout
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout action could be a simple reducer if no async actions needed
     // logout: (state) => {
     //   localStorage.removeItem('userInfo');
     //   state.userInfo = null;
     //   state.error = null;
     //   state.loading = false;
     // },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
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
        state.error = action.payload; // Error message from rejectWithValue
        state.userInfo = null;
      })
       // Logout reducers
      .addCase(logout.fulfilled, (state) => {
          state.userInfo = null;
          state.error = null;
          state.loading = false;
      });
  },
});

// export const { logout } = authSlice.actions; // Export if defined as simple reducer
export default authSlice.reducer;