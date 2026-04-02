import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axiosAdmin from '@/api/axiosAdmin';

// ── Context shape ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Access token lives ONLY in memory — never localStorage (XSS safe)
  const [accessToken, setAccessToken]   = useState(null);
  const [admin, setAdmin]               = useState(null);
  const [isLoading, setIsLoading]       = useState(true); // true while attempting silent refresh on mount
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ref to track in-flight refresh — prevents duplicate refresh calls
  const isRefreshing      = useRef(false);
  const refreshSubscribers = useRef([]); // queued requests waiting for new token

  // ── Silent refresh — called on mount and by Axios interceptor ────────────────
  const silentRefresh = useCallback(async () => {
    if (isRefreshing.current) {
      // Already refreshing — queue this call and wait
      return new Promise((resolve) => {
        refreshSubscribers.current.push(resolve);
      });
    }

    isRefreshing.current = true;
    try {
      const res = await axiosAdmin.post(
        '/api/auth/refresh',
        {},
        { withCredentials: true, _skipAuthRefresh: true } // skip interceptor for this call
      );

      const { accessToken: newToken, admin: adminData } = res.data.data;

      setAccessToken(newToken);
      setAdmin(adminData);
      setIsAuthenticated(true);

      // Notify all queued subscribers with new token
      refreshSubscribers.current.forEach((cb) => cb(newToken));
      refreshSubscribers.current = [];

      return newToken;

    } catch {
      // Refresh failed — session truly expired
      setAccessToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
      return null;

    } finally {
      isRefreshing.current = false;
    }
  }, []);

  // ── On mount: attempt silent refresh (restores session on page reload) ───────
  useEffect(() => {
    const initAuth = async () => {
      await silentRefresh();
      setIsLoading(false);
    };
    initAuth();
  }, [silentRefresh]);

  // ── Login ─────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await axiosAdmin.post(
      '/api/auth/login',
      { email, password },
      { withCredentials: true }
    );

    const { accessToken: token, admin: adminData } = res.data.data;

    setAccessToken(token);
    setAdmin(adminData);
    setIsAuthenticated(true);

    return adminData;
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await axiosAdmin.post(
        '/api/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch {
      // Continue logout even if API call fails
    } finally {
      setAccessToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
    }
  }, []);

  // ── Expose token getter for Axios interceptor ─────────────────────────────────
  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  const value = {
    admin,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    silentRefresh,
    getAccessToken,
    setAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Named export for clean imports
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthContext;