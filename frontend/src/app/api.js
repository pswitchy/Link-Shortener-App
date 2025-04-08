import axios from 'axios';

// Use Create React App's environment variable syntax
// Variable name in .env file MUST start with REACT_APP_
const SERVER_ROOT_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
// Note: Ensure your .env file in the 'client' directory has:
// REACT_APP_API_BASE_URL=http://localhost:5001

const api = axios.create({
  baseURL: `${SERVER_ROOT_URL}/api`, // Still add /api here to combine with the root URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
// This part remains the same as it uses standard browser APIs (localStorage)
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('userInfo');
    if (userString) {
      try {
          const userInfo = JSON.parse(userString);
          // Add extra check for userInfo object itself
          if (userInfo && typeof userInfo === 'object' && userInfo.token) {
            config.headers.Authorization = `Bearer ${userInfo.token}`;
          }
      } catch (e) {
          console.error("Error parsing userInfo from localStorage", e);
          // Optional: Clear corrupted item
          // localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;