import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getServices } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import useInView from '@/hooks/useInView';
import { staggerContainer, staggerItem } from '@/utils/motion';

const ICON_PATHS = {
  video:     <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>,
  scissors:  <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>,
  monitor:   <><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  film:      <><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></>,
  music:     <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  palette:   <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>,
  zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  star:      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  layers:    <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
  cpu:       <><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
};

const ServiceIcon = ({ name }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    {ICON_PATHS[name] || ICON_PATHS.video}
  </svg>
);

const ServicesPreview = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSite();
  const [ref, inView] = useInView();

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.data?.slice(0, 6) || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!settings.showServicesSection) return null;
  if (!isLoading && services.length === 0) return null;

  return (
    <section ref={ref} className="section relative overflow-hidden bg-night-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[320px] w-[320px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_32%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
            <span className="w-5 h-px bg-violet-400" />
            What I Do
          </span>

          <h2 className="mt-5 font-display text-4xl md:text-5xl text-white uppercase leading-[0.95]">
            Services that make
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-400">
              content look premium
            </span>
          </h2>

          <p className="text-slate-400 max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
            From raw footage to polished edits, I create content that grabs
            attention, improves retention, and feels built for modern platforms.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-3xl border border-white/5 bg-night-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((svc, i) => (
              <motion.div
                key={svc._id}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/25 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[linear-gradient(135deg,rgba(139,92,246,0.08),transparent_45%,rgba(99,102,241,0.06))]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-400/10 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform duration-300">
                      <ServiceIcon name={svc.icon} />
                    </div>

                    <span className="text-xs font-display text-slate-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-display text-xl text-white tracking-wide mb-2">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed min-h-[72px]">
                    {svc.shortDescription}
                  </p>

                  {svc.turnaround && (
                    <div className="mt-5 inline-flex items-center rounded-full border border-violet-500/15 bg-violet-500/[0.08] px-3 py-1.5 text-xs text-violet-200">
                      <span className="mr-2 text-violet-400">⏱</span>
                      {svc.turnaround}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25 hover:scale-[1.02] hover:shadow-purple-500/40 transition-all duration-300"
          >
            View all services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPreview;