// Button with magnetic mouse-attraction effect
// Wrap any CTA button with this for the premium feel

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticButton = ({
  children,
  strength  = 0.35,    // attraction strength 0–1
  className = '',
  style     = {},
}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMove = useCallback((e) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block ${className}`}
      data-magnetic={strength}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;