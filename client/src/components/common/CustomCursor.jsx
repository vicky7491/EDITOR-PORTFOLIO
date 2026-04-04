import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/utils/gsap';

const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const ringPos  = useRef({ x: -100, y: -100 });
  const [state, setState] = useState('default'); // 'default' | 'hover' | 'click' | 'text'

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rafId;

    // ── Smooth ring follow ─────────────────────────────────────────────────
    const animateRing = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      ring.style.transform =
        `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`;
      rafId = requestAnimationFrame(animateRing);
    };
    rafId = requestAnimationFrame(animateRing);

    // ── Track mouse ────────────────────────────────────────────────────────
    const onMove = (e) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      dot.style.transform =
        `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    const onDown = () => setState('click');
    const onUp   = () => setState((s) => s === 'click' ? 'default' : s);

    // ── Magnetic effect on interactive elements ────────────────────────────
    let magnetCleanups = [];

    const applyMagnetic = () => {
      magnetCleanups.forEach((fn) => fn());
      magnetCleanups = [];

      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic) || 0.4;

        const onEnter = () => setState('hover');
        const onLeave = () => {
          setState('default');
          gsap.to(el, {
            x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)',
          });
        };
        const onMagMove = (e) => {
          const rect   = el.getBoundingClientRect();
          const cx     = rect.left + rect.width  / 2;
          const cy     = rect.top  + rect.height / 2;
          const dx     = e.clientX - cx;
          const dy     = e.clientY - cy;
          gsap.to(el, {
            x: dx * strength, y: dy * strength,
            duration: 0.4, ease: 'power2.out',
          });
        };

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('mousemove',  onMagMove);

        magnetCleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
          el.removeEventListener('mousemove',  onMagMove);
        });
      });

      // Text inputs and paragraphs — beam cursor
      document.querySelectorAll('input, textarea, p, [data-cursor-text]').forEach((el) => {
        const onEnter = () => setState('text');
        const onLeave = () => setState('default');
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        magnetCleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      });

      // Links and buttons — expand ring
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        if (el.dataset.magnetic !== undefined) return; // already handled
        const onEnter = () => setState('hover');
        const onLeave = () => setState('default');
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        magnetCleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    };

    // Re-apply after DOM updates (route changes)
    const observer = new MutationObserver(applyMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });
    applyMagnetic();

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      magnetCleanups.forEach((fn) => fn());
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mouseup',    onUp);
    };
  }, []);

  // ── Cursor state styles ───────────────────────────────────────────────────
  const dotSize  = state === 'click' ? 'scale-50'  : 'scale-100';
  const ringSize =
    state === 'hover'  ? 'w-12 h-12 opacity-60 border-violet-400'    :
    state === 'click'  ? 'w-6  h-6  opacity-90 border-violet-400'    :
    state === 'text'   ? 'w-1  h-6  opacity-90 border-violet-400 rounded-none' :
    'w-8 h-8 opacity-50 border-white/50';

  return (
    <>
      {/* Dot — instant position */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full
                    bg-violet-400 pointer-events-none
                    transition-transform duration-150 ${dotSize}`}
        style={{ willChange: 'transform' }}
      />
      {/* Ring — spring follow */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9998] rounded-full border pointer-events-none
                    transition-all duration-200 ${ringSize}`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;