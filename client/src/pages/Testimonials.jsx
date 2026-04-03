import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getTestimonials } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';

const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24"
           fill={i < rating ? '#fbbf24' : 'none'}
           stroke={i < rating ? '#fbbf24' : '#374151'}
           strokeWidth={1.5} className="w-4 h-4">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                         12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const Testimonials = () => {
  const { settings }  = useSite();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => {
    getTestimonials()
      .then((r) => setTestimonials(r.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Testimonials — {settings.siteTitle || 'CineEdit'}</title>
        <meta name="description" content="What clients say about CineEdit video editing services."/>
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-night-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/8
                        via-transparent to-transparent pointer-events-none"/>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              Client Reviews
            </span>
            <h1 className="font-display text-title text-white uppercase">
              What Clients Say
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-night-800 animate-pulse"/>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-24 text-slate-600">
            No testimonials yet.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((tmn) => (
              <motion.div
                key={tmn._id}
                variants={staggerItem}
                className="glass p-6 hover:border-violet-500/20
                           transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="mb-4">
                  <Stars rating={tmn.rating}/>
                </div>

                {/* Quote */}
                <p className="text-slate-400 leading-relaxed text-sm flex-1 mb-5">
                  "{tmn.review}"
                </p>

                {/* Client */}
                <div className="flex items-center gap-3 pt-4
                                border-t border-white/[0.04]">
                  {tmn.photo?.url ? (
                    <img src={tmn.photo.url} alt={tmn.clientName}
                         className="w-10 h-10 rounded-full object-cover"/>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br
                                    from-violet-600 to-cyan-500 flex items-center
                                    justify-center text-white text-sm font-semibold shrink-0">
                      {tmn.clientName?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{tmn.clientName}</p>
                    <p className="text-xs text-slate-500">
                      {[tmn.clientTitle, tmn.company].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
};

export default Testimonials;