// Scroll-driven parallax depth layer

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/utils/helpers';

const ParallaxSection = ({
  children,
  speed       = 0.3,    // 0 = no parallax, 1 = full scroll speed, negative = reverse
  direction   = 'y',    // 'y' | 'x'
  className   = '',
  style       = {},
  scrub       = true,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const distance = 200 * speed;
    const toVars = direction === 'x'
      ? { x: distance }
      : { y: distance };

    const anim = gsap.fromTo(
      el,
      direction === 'x' ? { x: -distance / 2 } : { y: -distance / 2 },
      {
        ...toVars,
        ease: 'none',
        scrollTrigger: {
          trigger:  el.parentElement || el,
          start:    'top bottom',
          end:      'bottom top',
          scrub:    scrub ? 1 : false,
        },
      }
    );

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [speed, direction, scrub]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;