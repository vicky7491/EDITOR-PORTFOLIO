// Animated career timeline for the About page

import { useRef, useEffect } from 'react';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DEFAULT_MILESTONES = [
  {
    year:  '2019',
    title: 'Started the journey',
    desc:  'Began freelancing with YouTube creators, learning the craft of storytelling through editing.',
    color: '#8b5cf6',
  },
  {
    year:  '2020',
    title: 'First brand client',
    desc:  'Delivered first commercial video campaign for a D2C brand. Reached 50+ clients milestone.',
    color: '#06b6d4',
  },
  {
    year:  '2021',
    title: 'Went full-time',
    desc:  'Left my day job. Specialized in documentary-style brand films and YouTube long-form content.',
    color: '#8b5cf6',
  },
  {
    year:  '2022',
    title: 'International clients',
    desc:  'Worked with brands in the US, UK, and UAE. Added motion graphics and color grading to services.',
    color: '#06b6d4',
  },
  {
    year:  '2023',
    title: 'Studio established',
    desc:  'Set up a dedicated edit suite. Hired a junior editor. Reached 150+ completed projects.',
    color: '#8b5cf6',
  },
  {
    year:  '2024',
    title: 'Scaling up',
    desc:  'Expanded into cinematic ads and short-form content for social media. 200k+ combined views.',
    color: '#06b6d4',
  },
];

const Timeline = ({ milestones = DEFAULT_MILESTONES }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.timeline-item');
    if (!items?.length) return;

    const anims = [];
    items.forEach((item, i) => {
      const anim = gsap.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity:  1,
          x:        0,
          duration: 0.7,
          ease:     'power3.out',
          scrollTrigger: {
            trigger: item,
            start:   'top 85%',
            once:    true,
          },
        }
      );
      anims.push(anim);
    });

    return () => anims.forEach((a) => {
      a.kill();
      a.scrollTrigger?.kill();
    });
  }, [milestones]);

  return (
    <div ref={containerRef} className="relative">
      {/* Centre spine */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0
                      w-px bg-gradient-to-b from-transparent via-violet-500/30
                      to-transparent hidden md:block"/>

      <div className="space-y-10 md:space-y-0">
        {milestones.map((m, i) => (
          <div
            key={i}
            className={`timeline-item relative flex flex-col
              md:flex-row md:items-center gap-6
              ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
              mb-10`}
          >
            {/* Content card */}
            <div className="flex-1 md:max-w-[45%]">
              <div className="glass p-6 rounded-2xl hover:border-violet-500/20
                              transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="font-display text-2xl"
                    style={{ color: m.color }}
                  >
                    {m.year}
                  </span>
                  {m.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full
                                     bg-violet-600/20 text-violet-400 border
                                     border-violet-500/20">
                      {m.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl text-white uppercase mb-2
                               group-hover:text-violet-300 transition-colors">
                  {m.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            </div>

            {/* Centre dot */}
            <div className="hidden md:flex items-center justify-center w-10 shrink-0">
              <div
                className="w-4 h-4 rounded-full border-2 border-night-900
                           shadow-[0_0_12px_currentColor]"
                style={{ background: m.color, color: m.color }}
              />
            </div>

            {/* Spacer for opposite side */}
            <div className="hidden md:block flex-1 md:max-w-[45%]"/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;