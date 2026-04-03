import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useMediaQuery from '@/hooks/useMediaQuery';

const CustomCursor = () => {
  const isMobile  = useMediaQuery('(hover: none)');
  const [variant, setVariant] = useState('default'); // default | hover | click
  const [label,   setLabel]   = useState('');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth following spring
  const springX = useSpring(mouseX, { stiffness: 400, damping: 35, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 35, mass: 0.5 });

  // Dot follows exactly
  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40 });

  useEffect(() => {
    if (isMobile) return;

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleDown = () => setVariant('click');
    const handleUp   = () => setVariant('default');

    // Detect hoverable elements
    const handleEnter = (e) => {
      const el = e.target.closest('a, button, [data-cursor]');
      if (el) {
        setVariant('hover');
        setLabel(el.dataset.cursor || '');
      }
    };
    const handleLeave = (e) => {
      const el = e.target.closest('a, button, [data-cursor]');
      if (el) { setVariant('default'); setLabel(''); }
    };

    window.addEventListener('mousemove',  move);
    window.addEventListener('mousedown',  handleDown);
    window.addEventListener('mouseup',    handleUp);
    document.addEventListener('mouseover', handleEnter);
    document.addEventListener('mouseout',  handleLeave);

    return () => {
      window.removeEventListener('mousemove',  move);
      window.removeEventListener('mousedown',  handleDown);
      window.removeEventListener('mouseup',    handleUp);
      document.removeEventListener('mouseover', handleEnter);
      document.removeEventListener('mouseout',  handleLeave);
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) return null;

  const variants = {
    default: { width: 32, height: 32, backgroundColor: 'transparent',
               border: '1.5px solid rgba(167,139,250,0.6)', x: -16, y: -16 },
    hover:   { width: 64, height: 64, backgroundColor: 'rgba(139,92,246,0.12)',
               border: '1.5px solid rgba(139,92,246,0.8)', x: -32, y: -32 },
    click:   { width: 24, height: 24, backgroundColor: 'rgba(139,92,246,0.3)',
               border: '1.5px solid rgba(167,139,250,0.9)', x: -12, y: -12 },
  };

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]
                   flex items-center justify-center"
        style={{ left: springX, top: springY }}
        animate={variant}
        variants={variants}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {label && (
          <span className="text-[10px] font-medium text-brand-300 whitespace-nowrap">
            {label}
          </span>
        )}
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full
                   bg-brand-400 pointer-events-none z-[9999]"
        style={{ left: dotX, top: dotY, x: -3, y: -3 }}
      />
    </>
  );
};

export default CustomCursor;