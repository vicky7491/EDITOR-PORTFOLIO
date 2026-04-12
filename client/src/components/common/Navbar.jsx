import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSite } from '@/context/SiteContext';

const NAV_LINKS = [
  { to: '/',            label: 'Home'         },
  { to: '/about',       label: 'About'        },
  { to: '/portfolio',   label: 'Portfolio'    },
  { to: '/services',    label: 'Services'     },
  { to: '/testimonials',label: 'Testimonials' },
  { to: '/contact',     label: 'Contact'      },
];

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { settings } = useSite();
  const location     = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5 py-3'
            : 'py-6'}`}
      >
        <div className="section-container flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600
                            to-brand-400 flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-brand-600/40
                            transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="white"
                   strokeWidth={2} className="w-4 h-4">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              {settings?.siteTitle?.split('—')[0]?.trim() || 'VickyVfx'}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                   ${isActive
                     ? 'text-white bg-white/8'
                     : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden lg:inline-flex btn-primary text-sm py-2.5"
            >
              Hire Me
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center
                         gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen
                  ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-slate-300 block transition-all"
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                className="w-5 h-px bg-slate-300 block"
              />
              <motion.span
                animate={mobileOpen
                  ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-px bg-slate-300 block transition-all"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-40 pt-24 pb-8 px-6
                       bg-dark-950/95 backdrop-blur-2xl border-b border-white/5
                       lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors
                     ${isActive
                       ? 'text-white bg-brand-600/20 border border-brand-600/20'
                       : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-primary mt-4 text-center">
                Hire Me
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;