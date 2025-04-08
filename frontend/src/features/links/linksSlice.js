import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

const initialState = {
  links: [],
  pagination: {
      currentPage: 1,
      totalPages: 1,
      totalLinks: 0,
  },
  currentLinkAnalytics: null,
  loading: false, // General loading for list
  loadingAnalytics: false,
  loadingCreate: false,
  loadingUpdate: false, // Added
  loadingDelete: false, // Added
  error: null,
  createError: null,
  analyticsError: null,
  updateError: null,   // Added
  deleteError: null,   // Added
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

export const updateLink = createAsyncThunk(
  'links/updateLink',
  async ({ linkId, linkData }, { rejectWithValue }) => {
    try {
      // Only send fields that can be updated
      const updateData = {
          originalUrl: linkData.originalUrl,
          expiresAt: linkData.expiresAt || null // Send null if empty string
      };
      const { data } = await api.put(`/links/${linkId}`, updateData);
      return data; // Returns the updated link object from backend
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Async Thunk for deleting a link
export const deleteLink = createAsyncThunk(
  'links/deleteLink',
  async (linkId, { rejectWithValue }) => {
    try {
      await api.delete(`/links/${linkId}`);
      return linkId; // Return the ID of the deleted link for state update
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return rejectWithValue(message);
    }
  }
);

// Helper reset action (existing)
export const resetLinksState = () => (dispatch) => {
    dispatch(linksSlice.actions.resetState());
};


const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
      resetState: () => initialState,
      clearCreateError: (state) => { state.createError = null; },
      clearAnalytics: (state) => { state.currentLinkAnalytics = null; state.analyticsError = null; },
      clearUpdateError: (state) => { state.updateError = null; }, // Added
      clearDeleteError: (state) => { state.deleteError = null; }, // Added
  },
  extraReducers: (builder) => {
    builder
      // Fetch Links (existing)
      .addCase(fetchLinks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        // --- Add this back ---
        state.loading = false; // <<< SET LOADING TO FALSE
        state.links = action.payload.links;
        state.pagination = {
            currentPage: action.payload.currentPage,
            totalPages: action.payload.totalPages,
            totalLinks: action.payload.totalLinks,
        };
        state.error = null; // Clear error on success
        // --- End of added section ---
    })
    .addCase(fetchLinks.rejected, (state, action) => {
        // --- Add this back ---
        state.loading = false; // <<< SET LOADING TO FALSE
        state.error = action.payload; // Set the error message from rejectWithValue
        // Optional: Reset links/pagination on error if desired
        // state.links = [];
        // state.pagination = { currentPage: 1, totalPages: 1, totalLinks: 0 };
        // --- End of added section ---
    })
      // Create Link (existing - maybe modify fulfilled for simplicity)
      .addCase(createLink.pending, (state) => { state.loadingCreate = true; state.createError = null; })
      .addCase(createLink.fulfilled, (state, action) => {
          state.loadingCreate = false;
          state.createError = null;
          // Instead of unshift, let the component trigger a refetch on success
          // state.links.unshift(action.payload); // Can cause issues with pagination
      })
      .addCase(createLink.rejected, (state, action) => { state.loadingCreate = false; state.createError = action.payload; })
      // Fetch Link Analytics (existing)
      .addCase(fetchLinkAnalytics.pending, (state) => {
        state.loadingAnalytics = true;
        state.analyticsError = null;
        state.currentLinkAnalytics = null;
    })
    .addCase(fetchLinkAnalytics.fulfilled, (state, action) => {
        state.loadingAnalytics = false; // Ensure loading is false
        state.currentLinkAnalytics = action.payload.analytics;
        state.analyticsError = null;
    })
    .addCase(fetchLinkAnalytics.rejected, (state, action) => {
        state.loadingAnalytics = false; // Ensure loading is false
        state.analyticsError = action.payload;
        state.currentLinkAnalytics = null;
    })

       // Update Link (new)
      .addCase(updateLink.pending, (state) => {
          state.loadingUpdate = true;
          state.updateError = null;
      })
      .addCase(updateLink.fulfilled, (state, action) => {
          state.loadingUpdate = false;
          state.updateError = null;
          // Find and update the link in the current state
          const index = state.links.findIndex(link => link._id === action.payload._id);
          if (index !== -1) {
              state.links[index] = action.payload; // Replace with updated link
          }
          // Alternative: Trigger refetch in component
      })
      .addCase(updateLink.rejected, (state, action) => {
          state.loadingUpdate = false;
          state.updateError = action.payload;
      })

      // Delete Link (new)
      .addCase(deleteLink.pending, (state) => {
          state.loadingDelete = true;
          state.deleteError = null;
          // Optional: Mark link as deleting in UI?
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
          state.loadingDelete = false;
          state.deleteError = null;
          // Remove the link from the current state
          state.links = state.links.filter(link => link._id !== action.payload);
           state.pagination.totalLinks -= 1; // Decrement total count
           // Alternative: Trigger refetch in component (might be needed if deletion affects totalPages)
      })
      .addCase(deleteLink.rejected, (state, action) => {
          state.loadingDelete = false;
          state.deleteError = action.payload;
      });
  },
});

export const {
    clearCreateError,
    clearAnalytics,
    resetState,
    clearUpdateError, // Export new clear actions
    clearDeleteError
} = linksSlice.actions;
export default linksSlice.reducer;