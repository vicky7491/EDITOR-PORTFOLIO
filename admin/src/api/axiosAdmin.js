// The previous version had a module-level interceptorsReady flag that
// couldn't be reset on HMR. This version fixes that:

import axios from 'axios';

const axiosAdmin = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout:         15000,
  headers: { 'Content-Type': 'application/json' },
});

// Store interceptor IDs so we can eject and re-register
let requestInterceptorId  = null;
let responseInterceptorId = null;

export const setupInterceptors = (getAccessToken, silentRefresh, onLogout) => {
  // Eject any existing interceptors before re-registering
  // This prevents duplicate interceptors on React HMR
  if (requestInterceptorId  !== null) axiosAdmin.interceptors.request.eject(requestInterceptorId);
  if (responseInterceptorId !== null) axiosAdmin.interceptors.response.eject(responseInterceptorId);

  // ── Request: attach access token ──────────────────────────────────────────
  requestInterceptorId = axiosAdmin.interceptors.request.use(
    (config) => {
      if (config._skipAuthRefresh) return config;
      const token = getAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response: handle 401 → silent refresh → retry ─────────────────────────
  responseInterceptorId = axiosAdmin.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      if (
        error.response?.status === 401 &&
        !original._retried &&
        !original._skipAuthRefresh
      ) {
        original._retried = true;

        const newToken = await silentRefresh();

        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return axiosAdmin(original);
        } else {
          onLogout();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosAdmin;