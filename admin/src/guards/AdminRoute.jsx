import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageLoader from '@/components/ui/PageLoader';

/**
 * Wraps any admin page.
 * - Shows a loader while the auth state is initialising (silent refresh on mount)
 * - Redirects to /admin/login if not authenticated
 * - Renders children if authenticated
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Still checking — show full-page loader instead of flashing login page
  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    // Pass current location so we can redirect back after login
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;