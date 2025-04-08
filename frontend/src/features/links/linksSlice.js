import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

const initialState = {
  links: [],
  pagination: {
      currentPage: 1,
      totalPages: 1,
      totalLinks: 0,
  },
  currentLinkAnalytics: null, // For detailed view of one link
  loading: false, // General loading for list
  loadingAnalytics: false, // Specific loading for analytics fetch
  loadingCreate: false, // Specific loading for create operation
  error: null,
  createError: null,
  analyticsError: null,
};

// Async Thunk for fetching links
export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/links?page=${page}&limit=${limit}&search=${search}`);
      return data; // Expects { links: [], currentPage: N, totalPages: N, totalLinks: N }
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for creating a link
export const createLink = createAsyncThunk(
  'links/createLink',
  async (linkData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/links', linkData);
      return data; // Returns the newly created link object from backend
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for fetching detailed analytics for a single link
export const fetchLinkAnalytics = createAsyncThunk(
  'links/fetchLinkAnalytics',
  async (linkId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/links/${linkId}/analytics`);
      return { linkId, analytics: data };
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Helper reset action (optional, useful after logout)
export const resetLinksState = () => (dispatch) => {
    dispatch(linksSlice.actions.resetState());
};


const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
      resetState: () => initialState, // Resets state (e.g., on logout)
      clearCreateError: (state) => {
          state.createError = null;
      },
      clearAnalytics: (state) => {
        state.currentLinkAnalytics = null;
        state.analyticsError = null;
      },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Links
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload.links;
        state.pagination = {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalLinks: action.payload.totalLinks,
        };
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Link
      .addCase(createLink.pending, (state) => {
        state.loadingCreate = true;
        state.createError = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loadingCreate = false;
         // Add to the beginning of the list (or refetch?)
         // Refetching might be simpler if pagination/sorting is complex
         // state.links.unshift(action.payload);
         // For simplicity with pagination, we might just trigger a refetch in the component
         state.createError = null; // Clear error on success
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createError = action.payload;
      })
      // Fetch Link Analytics
      .addCase(fetchLinkAnalytics.pending, (state) => {
        state.loadingAnalytics = true;
        state.analyticsError = null;
        state.currentLinkAnalytics = null; // Clear previous analytics
      })
      .addCase(fetchLinkAnalytics.fulfilled, (state, action) => {
        state.loadingAnalytics = false;
        state.currentLinkAnalytics = action.payload.analytics; // Store fetched analytics
      })
      .addCase(fetchLinkAnalytics.rejected, (state, action) => {
        state.loadingAnalytics = false;
        state.analyticsError = action.payload;
      });
  },
});

export const { clearCreateError, clearAnalytics, resetState } = linksSlice.actions;
export default linksSlice.reducer;