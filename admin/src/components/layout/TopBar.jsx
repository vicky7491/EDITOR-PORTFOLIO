import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Map route paths to page titles
const PAGE_TITLES = {
  '/admin/dashboard':    { title: 'Dashboard',    subtitle: 'Overview & stats' },
  '/admin/projects':     { title: 'Projects',     subtitle: 'Manage portfolio projects' },
  '/admin/videos':       { title: 'Videos',       subtitle: 'Manage video library' },
  '/admin/categories':   { title: 'Categories',   subtitle: 'Organise content' },
  '/admin/services':     { title: 'Services',     subtitle: 'What you offer' },
  '/admin/testimonials': { title: 'Testimonials', subtitle: 'Client reviews' },
  '/admin/inquiries':    { title: 'Inquiries',    subtitle: 'Contact messages' },
  '/admin/homepage':     { title: 'Homepage',     subtitle: 'Edit homepage content' },
  '/admin/settings':     { title: 'Settings',     subtitle: 'Site configuration' },
};

const TopBar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const { admin, logout } = useAuth();

  // Match the current page title (handle sub-routes like /projects/new)
  const matchedKey = Object.keys(PAGE_TITLES).find((key) =>
    pathname === key || pathname.startsWith(key + '/')
  );
  const pageInfo = PAGE_TITLES[matchedKey] || { title: 'Admin', subtitle: '' };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4
                       bg-surface-900/80 backdrop-blur-sm border-b border-white/5
                       shrink-0 sticky top-0 z-30">

      {/* Left: menu button (mobile) + page title */}
      <div className="flex items-center gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400
                     hover:text-slate-100 hover:bg-white/5 transition-colors"
          aria-label="Open navigation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-5 h-5">
            <line x1="3" y1="6"  x2="21" y2="6"  strokeLinecap="round"/>
            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
          </svg>
        </button>

        <div>
          <h1 className="text-base font-semibold text-slate-100">
            {pageInfo.title}
          </h1>
          {pageInfo.subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block">
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: view site + admin avatar */}
      <div className="flex items-center gap-3">
        {/* View live site */}
        <a
          href={import.meta.env.VITE_CLIENT_URL || '/'}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs
                     text-slate-500 hover:text-slate-300 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.5} className="w-3.5 h-3.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="15 3 21 3 21 9"
                  strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="10" y1="14" x2="21" y2="3"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View site
        </a>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        {/* Admin avatar + quick logout */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br
                          from-brand-600 to-accent-500 flex items-center
                          justify-center text-white text-xs font-semibold">
            {admin?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex text-xs text-slate-500
                       hover:text-red-400 transition-colors duration-200"
            title="Log out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                    strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7"
                    strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;