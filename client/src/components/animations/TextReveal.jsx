// Cinematic character-by-character text reveal
// Wrap any heading with this component

import { useEffect, useRef } from 'react';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/utils/helpers';

const TextReveal = ({
  children,
  as          = 'h2',
  delay       = 0,
  stagger     = 0.025,
  duration    = 0.8,
  y           = 60,
  trigger     = true,   // if false, plays immediately
  className   = '',
  splitBy     = 'words', // 'words' | 'chars'
}) => {
  const containerRef = useRef(null);
  const Tag = as;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    const text = el.innerText;

    // ── Split text into spans ─────────────────────────────────────────────
    let units;
    if (splitBy === 'chars') {
      units = text.split('').map((char) =>
        char === ' ' ? '<span class="inline-block">&nbsp;</span>' :
        `<span class="inline-block overflow-hidden"><span class="inline-block char-inner">${char}</span></span>`
      );
    } else {
      units = text.split(' ').map((word) =>
        `<span class="inline-block overflow-hidden mr-[0.25em]"><span class="inline-block word-inner">${word}</span></span>`
      );
    }

    el.innerHTML = units.join('');

    const innerSpans = el.querySelectorAll('.char-inner, .word-inner');

    // Set initial state
    gsap.set(innerSpans, { y, opacity: 0, rotateX: -40 });

    // ── Animate ───────────────────────────────────────────────────────────
    const anim = gsap.to(innerSpans, {
      y:         0,
      opacity:   1,
      rotateX:   0,
      duration,
      delay,
      stagger,
      ease:      'power3.out',
      paused:    trigger,
    });

    if (trigger) {
      ScrollTrigger.create({
        trigger:  el,
        start:    'top 85%',
        onEnter:  () => anim.play(),
        once:     true,
      });
    }

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === el) t.kill();
      });
    };
  }, [children, delay, stagger, duration, y, trigger, splitBy]);

  return (
    <Tag ref={containerRef} className={`perspective-1000 ${className}`}>
      {children}
    </Tag>
  );
};

export default TextReveal;