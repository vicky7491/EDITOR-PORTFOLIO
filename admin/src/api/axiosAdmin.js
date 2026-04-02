import axios from 'axios';

// ── Base instance ─────────────────────────────────────────────────────────────
const axiosAdmin = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '',
  withCredentials: true,   // Always send cookies (needed for refresh token)
  timeout:         15000,  // 15s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Track if interceptors have been set up (prevent double-registration) ──────
let interceptorsReady = false;

// ── Setup function — called from App.jsx after AuthContext is ready ─────────
export const setupInterceptors = (getAccessToken, silentRefresh, onLogout) => {
  if (interceptorsReady) return;
  interceptorsReady = true;

  // ── Request interceptor: attach access token to every request ───────────────
  axiosAdmin.interceptors.request.use(
    (config) => {
      // Skip auth header for refresh call itself
      if (config._skipAuthRefresh) return config;

      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response interceptor: handle 401 → try silent refresh → retry ────────────
  axiosAdmin.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only handle 401 Unauthorized errors, and only once per request
      if (
        error.response?.status === 401 &&
        !originalRequest._retried &&
        !originalRequest._skipAuthRefresh
      ) {
        originalRequest._retried = true;

        // Attempt silent token refresh
        const newToken = await silentRefresh();

        if (newToken) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosAdmin(originalRequest);
        } else {
          // Refresh also failed — session dead, force logout
          onLogout();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosAdmin;