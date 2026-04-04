// Infinite scrolling ticker/marquee
// Used between sections as a visual separator

import { useRef, useEffect } from 'react';
import { gsap } from '@/utils/gsap';

const ITEMS = [
  'Video Editing',
  'Color Grading',
  'Motion Graphics',
  'Sound Design',
  'Documentary',
  'Brand Films',
  'YouTube Content',
  'Short-Form Ads',
  'Visual Storytelling',
  'Cinematic Grade',
];

const MarqueeBar = ({
  items     = ITEMS,
  speed     = 30,         // seconds for one full loop
  direction = 'left',     // 'left' | 'right'
  separator = '✦',
  className = '',
  dark      = false,
}) => {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    const from = direction === 'left' ? 0       : -totalWidth;
    const to   = direction === 'left' ? -totalWidth : 0;

    gsap.fromTo(
      track,
      { x: from },
      {
        x:        to,
        duration: speed,
        ease:     'none',
        repeat:   -1,
      }
    );

    return () => gsap.killTweensOf(track);
  }, [speed, direction]);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div
      className={`overflow-hidden whitespace-nowrap py-4
        ${dark ? 'bg-night-800 border-y border-white/[0.04]'
               : 'bg-night-900 border-y border-white/[0.04]'}
        ${className}`}
    >
      <div ref={trackRef} className="inline-flex items-center gap-0 will-change-transform">
        {allItems.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="font-display text-sm tracking-widest uppercase
                             text-slate-500 hover:text-violet-400 transition-colors
                             duration-300">
              {item}
            </span>
            <span className="text-violet-600 text-xs">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBar;