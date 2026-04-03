import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSite } from '@/context/SiteContext';
import useInView from '@/hooks/useInView';

// Animated counter
const Counter = ({ target, inView }) => {
  const [count, setCount] = useState(0);
  const numeric = parseInt(target?.replace(/\D/g, '')) || 0;
  const suffix  = target?.replace(/[0-9]/g, '') || '';

  useEffect(() => {
    if (!inView || !numeric) return;
    let start = 0;
    const duration = 1800;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setCount(numeric);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numeric]);

  return (
    <span>
      {inView ? count : 0}{suffix}
    </span>
  );
};

const StatsBar = () => {
  const { settings }  = useSite();
  const [ref, inView] = useInView();
  const stats = settings.stats || [];

  if (stats.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative py-16 bg-night-800 border-y border-white/[0.04] overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5
                      via-transparent to-cyan-600/5 pointer-events-none"/>

      <div className="max-w-5xl mx-auto px-6">
        <div className={`grid gap-8 ${
          stats.length <= 3
            ? 'grid-cols-' + stats.length
            : 'grid-cols-2 sm:grid-cols-4'
        }`}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-display text-4xl sm:text-5xl text-gradient-violet mb-2">
                <Counter target={stat.value} inView={inView}/>
              </div>
              <p className="text-xs text-slate-500 tracking-widest uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;