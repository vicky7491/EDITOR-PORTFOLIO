import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useSite } from '@/context/SiteContext';
import HeroScene from '@/components/three/HeroScene';
import { fadeUp, staggerContainer, staggerItem } from '@/utils/motion';

const Hero = () => {
  const { settings }   = useSite();
  const titleRef       = useRef(null);
  const hero           = settings?.hero;
  const ctaButtons     = hero?.ctaButtons || [];

  // GSAP text reveal on mount
  useEffect(() => {
    if (!titleRef.current) return;
    gsap.fromTo(
      titleRef.current.querySelectorAll('.char'),
      { opacity: 0, y: 60, rotationX: -90 },
      {
        opacity: 1, y: 0, rotationX: 0,
        duration: 0.8, stagger: 0.02,
        ease: 'back.out(1.5)',
        delay: 0.3,
      }
    );
  }, []);

  const title     = hero?.title    || 'Transforming Footage Into Cinematic Stories';
  const subtitle  = hero?.subtitle || 'Award-winning video editor specializing in cinematic storytelling, color grading, and motion design.';

  // Split title into chars for GSAP animation
  const titleChars = title.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ opacity: 0 }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* 3D scene background */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b
                      from-dark-950/60 via-dark-950/40 to-dark-950/90
                      pointer-events-none"/>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-30 pointer-events-none"/>

      {/* Content */}
      <div className="relative z-10 section-container text-center pt-24">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                     border border-brand-500/30 bg-brand-600/10 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>
          <span className="text-brand-300 text-xs font-medium tracking-widest uppercase">
            Available for projects
          </span>
        </motion.div>

        {/* Main title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold
                     text-white leading-[1.05] tracking-tight mb-6 max-w-5xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          {titleChars}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {ctaButtons.length > 0 ? (
            ctaButtons.map((btn, i) => (
              <Link
                key={i}
                to={btn.link || '/portfolio'}
                className={i === 0 ? 'btn-primary text-base px-8 py-4' : 'btn-outline text-base px-8 py-4'}
              >
                {btn.label}
              </Link>
            ))
          ) : (
            <>
              <Link to="/portfolio" className="btn-primary text-base px-8 py-4">
                View Work
              </Link>
              <Link to="/contact" className="btn-outline text-base px-8 py-4">
                Hire Me
              </Link>
            </>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2
                     flex flex-col items-center gap-2"
        >
          <span className="text-slate-600 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-brand-500 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;