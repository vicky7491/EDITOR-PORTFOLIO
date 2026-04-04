// Animated counter — counts from 0 to target when scrolled into view

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/utils/helpers';

const CountUp = ({
  target,           // string like '150+' or '5 Years'
  duration  = 2,
  className = '',
}) => {
  const ref     = useRef(null);
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Parse numeric part and suffix
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, '')) || 0;
    const suffix  = String(target).replace(/[0-9.]/g, '');

    if (prefersReducedMotion()) {
      setDisplay(target);
      return;
    }

    const obj = { val: 0 };

    const anim = gsap.to(obj, {
      val:      numeric,
      duration,
      ease:     'power2.out',
      onUpdate: () => {
        const rounded = Number.isInteger(numeric)
          ? Math.floor(obj.val)
          : obj.val.toFixed(1);
        setDisplay(`${rounded}${suffix}`);
      },
      onComplete: () => setDisplay(target),
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start:   'top 85%',
      onEnter: () => anim.play(),
      once:    true,
    });

    return () => {
      anim.kill();
      trigger.kill();
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
};

export default CountUp;