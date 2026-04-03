import { useEffect, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

/**
 * Tracks mouse position relative to a target element.
 * Returns normalized -0.5 to +0.5 values for x and y.
 *
 * Usage (3D tilt effect):
 *   const { ref, normalizedX, normalizedY } = useMousePosition();
 *   <div ref={ref} style={{ rotateX: normalizedY * -10, rotateY: normalizedX * 10 }} />
 */
const useMousePosition = () => {
  const ref         = useRef(null);
  const normalizedX = useMotionValue(0);
  const normalizedY = useMotionValue(0);
  const rawX        = useMotionValue(0);
  const rawY        = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Raw pixel position within element
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
      // Normalized -0.5 to +0.5
      normalizedX.set((e.clientX - rect.left) / rect.width  - 0.5);
      normalizedY.set((e.clientY - rect.top)  / rect.height - 0.5);
    };

    const handleLeave = () => {
      // Spring back to center
      normalizedX.set(0);
      normalizedY.set(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [normalizedX, normalizedY, rawX, rawY]);

  return { ref, normalizedX, normalizedY, rawX, rawY };
};

export default useMousePosition;