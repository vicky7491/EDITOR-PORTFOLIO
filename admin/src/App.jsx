import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { setupInterceptors } from '@/api/axiosAdmin';

import AdminRoute   from '@/guards/AdminRoute';
import AdminLayout  from '@/components/layout/AdminLayout';
import Login        from '@/pages/Login';
import PageLoader   from '@/components/ui/PageLoader';

// ── Lazy-loaded admin pages ───────────────────────────────────────────────────
import { lazy, Suspense } from 'react';

const Dashboard          = lazy(() => import('@/pages/Dashboard'));
const ProjectsList       = lazy(() => import('@/pages/projects/ProjectsList'));
const ProjectEditor      = lazy(() => import('@/pages/projects/ProjectEditor'));
const VideosList         = lazy(() => import('@/pages/videos/VideosList'));
const VideoUploader      = lazy(() => import('@/pages/videos/VideoUploader'));
const CategoriesManager  = lazy(() => import('@/pages/categories/CategoriesManager'));
const ServicesManager    = lazy(() => import('@/pages/services/ServicesManager'));
const TestimonialsManager = lazy(() => import('@/pages/testimonials/TestimonialsManager'));
const InquiriesManager   = lazy(() => import('@/pages/inquiries/InquiriesManager'));
const InquiryDetail      = lazy(() => import('@/pages/inquiries/InquiryDetail'));
const HomepageEditor     = lazy(() => import('@/pages/homepage/HomepageEditor'));
const SiteSettingsPage   = lazy(() => import('@/pages/settings/SiteSettingsPage'));
const ChangePassword     = lazy(() => import('@/pages/settings/ChangePassword'));
const MediaLibrary       = lazy(() => import('@/pages/media/MediaLibrary'));
const ProjectReorder     = lazy(() => import('@/pages/projects/ProjectReorder'));

const App = () => {
  const { getAccessToken, silentRefresh, logout } = useAuth();

  // ── Register Axios interceptors once AuthContext is ready ─────────────────
  useEffect(() => {
    setupInterceptors(getAccessToken, silentRefresh, logout);
  }, [getAccessToken, silentRefresh, logout]);

  return (
    <Suspense fallback={<PageLoader message="Loading page..." />}>
      <Routes>
        {/* ── Public auth route ────────────────────────────────────────────── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── Protected admin routes ────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Projects */}
          <Route path="projects"           element={<ProjectsList />} />
          <Route path="projects/new"       element={<ProjectEditor />} />
          <Route path="projects/edit/:id"  element={<ProjectEditor />} />

          {/* Videos */}
          <Route path="videos"             element={<VideosList />} />
          <Route path="videos/upload"      element={<VideoUploader />} />
          <Route path="videos/edit/:id"    element={<VideoUploader />} />

          {/* Other management pages */}
          <Route path="categories"         element={<CategoriesManager />} />
          <Route path="services"           element={<ServicesManager />} />
          <Route path="testimonials"       element={<TestimonialsManager />} />
          <Route path="media"              element={<MediaLibrary/>} />
          <Route path="projects/reorder"   element={<ProjectReorder />} />

          {/* Inquiries */}
          <Route path="inquiries"          element={<InquiriesManager />} />
          <Route path="inquiries/:id"      element={<InquiryDetail />} />

          {/* Site content */}
          <Route path="homepage"           element={<HomepageEditor />} />
          <Route path="settings"           element={<SiteSettingsPage />} />
          <Route path="settings/password"  element={<ChangePassword />} />
        </Route>

        {/* ── Fallback ──────────────────────────────────────────────────────── */}
        <Route path="/"      element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*"      element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;