import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
       className="w-6 h-6">
    {ICON_PATHS[name] || ICON_PATHS.video}
  </svg>
);

const ServicesPreview = () => {
  const [services,  setServices]  = useState([]);
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
    <section ref={ref} className="section bg-night-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <span className="section-tag justify-center">
          <span className="w-6 h-px bg-violet-400"/>
          What I Do
        </span>
        <h2 className="font-display text-title text-white uppercase">
          Services
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto mt-4 text-sm leading-relaxed">
          From raw footage to cinematic masterpiece — every service tailored to your vision.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-night-800 animate-pulse"/>
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
              whileHover={{ y: -4 }}
              className="glass p-6 group hover:border-violet-500/20
                         transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center
                              justify-center text-violet-400 mb-4
                              group-hover:bg-violet-600/20 transition-colors duration-300">
                <ServiceIcon name={svc.icon}/>
              </div>
              <h3 className="font-display text-lg text-white mb-2 tracking-wide">
                {svc.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {svc.shortDescription}
              </p>
              {svc.turnaround && (
                <p className="text-xs text-violet-400/60 mt-3">
                  ⏱ {svc.turnaround}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="text-center mt-10"
      >
        <Link to="/services" className="btn-outline">
          View all services
        </Link>
      </motion.div>
    </section>
  );
};

export default ServicesPreview;