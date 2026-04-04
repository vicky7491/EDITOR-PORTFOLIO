// Universal scroll-triggered reveal wrapper
// Wraps any content — fades up, slides in, or scales in on scroll

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/utils/helpers';

const ScrollReveal = ({
  children,
  variant   = 'fadeUp',  // 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp'
  delay     = 0,
  duration  = 0.8,
  threshold = '85%',     // '85%' = element top hits 85% from top of viewport
  once      = true,
  stagger   = 0,         // if > 0, staggers direct children
  className = '',
  style     = {},
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = stagger > 0 ? [...el.children] : [el];

    // ── Initial state per variant ─────────────────────────────────────────
    const fromVars = {
      fadeUp:     { y: 50,  opacity: 0 },
      fadeIn:     {         opacity: 0 },
      slideLeft:  { x: 80,  opacity: 0 },
      slideRight: { x: -80, opacity: 0 },
      scaleUp:    { scale: 0.88, opacity: 0 },
    }[variant] || { y: 50, opacity: 0 };

    const toVars = {
      y: 0, x: 0, scale: 1, opacity: 1,
      duration,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      ease: 'power3.out',
      scrollTrigger: {
        trigger:  el,
        start:    `top ${threshold}`,
        toggleActions: once
          ? 'play none none none'
          : 'play none none reverse',
      },
    };

    gsap.set(targets, fromVars);
    const anim = gsap.to(targets, toVars);

    return () => {
      anim.kill();
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
    };
  }, [variant, delay, duration, threshold, once, stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export default ScrollReveal;