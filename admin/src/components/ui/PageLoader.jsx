import { motion } from 'framer-motion';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-surface-950 flex flex-col items-center justify-center z-50">
      {/* Animated logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-8"
      >
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-transparent border-t-brand-500 border-r-brand-500/30"
        />
        {/* Inner ring — opposite direction */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent-400 border-l-accent-400/30"
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gradient text-xl font-semibold tracking-wide mb-2"
      >
        VickyVfx
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-500 text-sm"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default PageLoader;