import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/utils/helpers';

/**
 * Comprehensive scroll animation hook.
 * Returns ref + animation state — attach ref to any element.
 *
 * Usage:
 *   const { ref, isVisible, scrollProgress } = useScrollAnimation();
 *
 * Options:
 *   threshold     - 0–1, how much of element must be visible (default 0.15)
 *   rootMargin    - IntersectionObserver rootMargin (default '0px')
 *   once          - only trigger once (default true)
 *   trackProgress - also track scroll progress through element (default false)
 */
const useScrollAnimation = ({
  threshold     = 0.15,
  rootMargin    = '0px',
  once          = true,
  trackProgress = false,
} = {}) => {
  const ref             = useRef(null);
  const [isVisible,     setIsVisible]     = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion   = prefersReducedMotion();

  // Visibility observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If user prefers reduced motion, mark visible immediately
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, reducedMotion]);

  // Scroll progress tracker (0 = element at bottom of viewport, 1 = element at top)
  useEffect(() => {
    if (!trackProgress || !isVisible) return;
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect     = el.getBoundingClientRect();
      const vh       = window.innerHeight;
      const progress = 1 - (rect.bottom / (vh + rect.height));
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run immediately
    return () => window.removeEventListener('scroll', onScroll);
  }, [trackProgress, isVisible]);

  return { ref, isVisible, scrollProgress };
};

export default useScrollAnimation;