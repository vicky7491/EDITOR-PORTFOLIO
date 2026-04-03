// Public axios instance — no auth headers

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || '',
  timeout:  12000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    // Network error (server unreachable)
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;