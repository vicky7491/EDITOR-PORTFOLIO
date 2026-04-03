import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeaturedTestimonials } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import useInView from '@/hooks/useInView';

const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill={i < rating ? '#fbbf24' : 'none'}
           stroke={i < rating ? '#fbbf24' : '#374151'}
           strokeWidth={1.5} className="w-3.5 h-3.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                         12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const TestimonialsPreview = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [current,      setCurrent]      = useState(0);
  const { settings }  = useSite();
  const [ref, inView] = useInView();
  const intervalRef   = useRef(null);

  useEffect(() => {
    getFeaturedTestimonials(6)
      .then((res) => setTestimonials(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [testimonials.length]);

  if (!settings.showTestimonialsSection) return null;
  if (!isLoading && testimonials.length === 0) return null;

  const active = testimonials[current];

  return (
    <section ref={ref} className="section bg-night-800 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 bg-gradient-radial from-violet-600/5
                      via-transparent to-transparent pointer-events-none"/>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <span className="section-tag justify-center">
          <span className="w-6 h-px bg-violet-400"/>
          Client Stories
        </span>
        <h2 className="font-display text-title text-white uppercase">
          What Clients Say
        </h2>
      </motion.div>

      {isLoading ? (
        <div className="max-w-2xl mx-auto h-48 rounded-2xl bg-night-900 animate-pulse"/>
      ) : active ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {/* Quote card */}
          <div className="glass p-8 text-center relative">
            {/* Quote mark */}
            <div className="font-display text-8xl text-violet-600/20 leading-none
                            absolute top-2 left-6 select-none">"</div>

            {/* Stars */}
            <div className="flex justify-center mb-4">
              <Stars rating={active.rating}/>
            </div>

            {/* Review */}
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-300 text-lg leading-relaxed mb-6 relative z-10"
            >
              "{active.review}"
            </motion.p>

            {/* Client info */}
            <div className="flex items-center justify-center gap-3">
              {active.photo?.url ? (
                <img src={active.photo.url} alt={active.clientName}
                     className="w-10 h-10 rounded-full object-cover"/>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br
                                from-violet-600 to-cyan-500 flex items-center
                                justify-center text-white text-sm font-semibold">
                  {active.clientName?.[0]}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-white">{active.clientName}</p>
                <p className="text-xs text-slate-500">
                  {[active.clientTitle, active.company].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); clearInterval(intervalRef.current); }}
                  className={`h-1 rounded-full transition-all duration-300
                    ${i === current ? 'w-8 bg-violet-400' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
        className="text-center mt-10"
      >
        <Link to="/testimonials" className="btn-outline">
          Read all reviews
        </Link>
      </motion.div>
    </section>
  );
};

export default TestimonialsPreview;