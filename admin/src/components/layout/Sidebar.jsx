import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

// ── Nav structure ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    group: 'Overview',
    links: [
      { to: '/admin/dashboard',   label: 'Dashboard',     icon: 'grid' },
    ],
  },
  {
    group: 'Content',
    links: [
      { to: '/admin/projects',    label: 'Projects',      icon: 'film' },
      { to: '/admin/projects/reorder', label: 'Reorder', icon: 'sort' },
      { to: '/admin/videos',      label: 'Videos',        icon: 'play' },
      { to: '/admin/categories',  label: 'Categories',    icon: 'tag' },
      { to: '/admin/media',    label: 'Media Library', icon: 'image' },
    ],
  },
  {
    group: 'Services',
    links: [
      { to: '/admin/services',    label: 'Services',      icon: 'briefcase' },
      { to: '/admin/plans',       label: 'Pricing Plans', icon: 'dollar-sign' },
      { to: '/admin/testimonials',label: 'Testimonials',  icon: 'star' },
    ],
  },
  {
    group: 'Engagement',
    links: [
      { to: '/admin/inquiries',   label: 'Inquiries',     icon: 'mail' },
    ],
  },
  {
    group: 'Site',
    links: [
      { to: '/admin/homepage',    label: 'Homepage',      icon: 'layout' },
      { to: '/admin/settings',    label: 'Settings',      icon: 'settings' },
    ],
  },
];

// ── Inline SVG icons (avoids icon lib dependency) ─────────────────────────────
const ICONS = {
  image:     <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  sort:      <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  grid:      <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  film:      <><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></>,
  play:      <><polygon points="5 3 19 12 5 21 5 3"/></>,
  tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
  'dollar-sign': <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  star:      <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  mail:      <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
  layout:    <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
  settings:  <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
};

const NavIcon = ({ name }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
       strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0">
    {ICONS[name]}
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const Sidebar = ({ onClose }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <aside className="flex flex-col w-full h-full bg-surface-900
                      border-r border-white/5 overflow-y-auto">

      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg
                        bg-gradient-to-br from-brand-600 to-accent-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="white"
               strokeWidth={2} className="w-4 h-4">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">CineEdit</p>
          <p className="text-xs text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase
                          tracking-widest text-slate-600">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.links.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <NavIcon name={icon} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/5">
        {/* Admin info */}
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br
                          from-brand-600 to-accent-500 flex items-center
                          justify-center text-white text-xs font-semibold shrink-0">
            {admin?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">
              {admin?.email || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-600 capitalize">
              {admin?.role || 'admin'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-400/70 hover:text-red-400
                     hover:bg-red-500/5 mt-1"
        >
          <NavIcon name="logout" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;