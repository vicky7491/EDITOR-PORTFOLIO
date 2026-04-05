import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from '@/utils/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSite } from '@/context/SiteContext';
import MagneticButton  from '@/components/animations/MagneticButton';
import MarqueeBar      from '@/components/animations/MarqueeBar';
import CountUp         from '@/components/animations/CountUp';
import ScrollReveal    from '@/components/animations/ScrollReveal';
import NoiseOverlay    from '@/components/common/NoiseOverlay';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '150+', label: 'Projects Completed' },
  { value: '98%',  label: 'Client Satisfaction' },
  { value: '5+',   label: 'Years of Experience' },
  { value: '40+',  label: 'Brands Worked With' },
];

const SPECIALIZATIONS = [
  {
    number: '01',
    title:  'Brand Storytelling',
    desc:   'Transforming a brand\'s vision into a cinematic narrative that resonates, converts, and stays with the viewer long after they\'ve stopped watching.',
    tags:   ['Corporate Films', 'Product Launches', 'Brand Ads'],
    color:  '#8b5cf6',
  },
  {
    number: '02',
    title:  'YouTube & Long-Form',
    desc:   'Pacing, retention, structure — I understand the algorithm and the audience. Long-form content that keeps people watching until the very last second.',
    tags:   ['YouTube Series', 'Documentaries', 'Vlogs'],
    color:  '#06b6d4',
  },
  {
    number: '03',
    title:  'Short-Form & Social',
    desc:   'Thumb-stopping edits built for the scroll. Hook in the first two seconds, deliver the message, leave them wanting more. Every frame earns its place.',
    tags:   ['Reels', 'TikTok', 'Ads'],
    color:  '#8b5cf6',
  },
  {
    number: '04',
    title:  'Motion & Color',
    desc:   'Motion graphics that elevate, and color grades that define mood. The technical craft underneath the story that most viewers feel without noticing.',
    tags:   ['Motion Graphics', 'Color Grading', 'VFX'],
    color:  '#06b6d4',
  },
];

const TOOLS = [
  { name: 'Premiere Pro',  abbr: 'Pr',  color: '#9999FF' },
  { name: 'After Effects', abbr: 'Ae',  color: '#9999FF' },
  { name: 'DaVinci',       abbr: 'DV',  color: '#E8872B' },
  { name: 'Final Cut',     abbr: 'FC',  color: '#E8D44D' },
  { name: 'Cinema 4D',     abbr: 'C4',  color: '#1B76BE' },
  { name: 'Audition',      abbr: 'Au',  color: '#1E5C73' },
  { name: 'Photoshop',     abbr: 'Ps',  color: '#31A8FF' },
  { name: 'Illustrator',   abbr: 'Ai',  color: '#FF9A00' },
  { name: 'Frame.io',      abbr: 'Fi',  color: '#1A1A2E' },
  { name: 'Notion',        abbr: 'No',  color: '#FFFFFF' },
  { name: 'LUTify',        abbr: 'Lu',  color: '#FF6B6B' },
  { name: 'Topaz',         abbr: 'To',  color: '#4ECDC4' },
];

const CLIENTS = [
  'Nike', 'Spotify', 'Red Bull', 'Google', 'Adobe',
  'Samsung', 'Airbnb', 'Netflix', 'Shopify', 'Patagonia',
];

const STORY_CHAPTERS = [
  {
    year:  '2019',
    label: 'The Beginning',
    body:  'It started with a laptop, a cracked copy of Premiere, and a YouTube channel nobody watched. I stayed up until 3am every night learning — not because I had to, but because I genuinely could not stop.',
  },
  {
    year:  '2020',
    label: 'First Real Client',
    body:  'A D2C skincare brand found me through a cold email I almost didn\'t send. That one project turned into six. I learned that great editing isn\'t about the software — it\'s about understanding what the client actually needs to say.',
  },
  {
    year:  '2021',
    label: 'Going Full-Time',
    body:  'I quit my job on a Tuesday. By Friday I had three new clients. The risk was real but so was the momentum. Specialized in documentary-style storytelling and never looked back.',
  },
  {
    year:  '2022',
    label: 'Going International',
    body:  'US, UK, UAE. Remote collaboration became my superpower. Built systems, refined my workflow, and started saying no to projects that didn\'t push me creatively.',
  },
  {
    year:  '2023',
    label: 'The Studio',
    body:  'A dedicated edit suite. A junior editor. A proper process. What started as one person with a laptop became a small but dangerous creative operation.',
  },
  {
    year:  'Now',
    label: 'Right Here',
    body:  'Over 150 projects. 5 years deep. Still learning something new every single edit. If you\'re reading this, there\'s a good chance we\'re supposed to work together.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Full-bleed reel hero ──────────────────────────────────────────────────────
const AboutHero = ({ showreelUrl }) => {
  const heroRef     = useRef(null);
  const videoRef    = useRef(null);
  const headingRef  = useRef(null);
  const overlayRef  = useRef(null);

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset:  ['start start', 'end start'],
  });

  // Parallax the video slower than scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // Fade out text as user scrolls
  const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY  = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%']);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(overlayRef.current,
          { opacity: 1 },
          { opacity: 0.55, duration: 1.5 }, 0)
        .fromTo(headingRef.current.querySelectorAll('.word'),
          { y: 80, opacity: 0, rotateX: -40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.07 }, 0.3);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden flex items-end pb-20"
    >
      {/* ── Video / gradient background ────────────────────────────────── */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 scale-110">
        {showreelUrl ? (
          <video
            ref={videoRef}
            src={showreelUrl}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          // Animated gradient fallback
          <div className="w-full h-full bg-night-900 relative overflow-hidden">
            <div className="absolute inset-0">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px]
                           bg-violet-600/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]
                           bg-cyan-600/15 rounded-full blur-3xl"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Gradient overlays ──────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/60
                   to-night-900/20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-night-900/70
                      via-transparent to-transparent"/>

      {/* ── Heading ────────────────────────────────────────────────────── */}
      <motion.div
        style={{ opacity: textOp, y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        {/* Eyebrow */}
        <p className="text-violet-400 text-xs tracking-[0.4em] uppercase font-medium mb-6">
          The Editor
        </p>

        {/* Big display headline */}
        <div
          ref={headingRef}
          className="perspective-1000 overflow-hidden"
        >
          {['Not just', 'cuts —', 'Craft.'].map((word, i) => (
            <div
              key={i}
              className={`word block font-display leading-[0.9] uppercase
                          ${i === 2
                            ? 'text-gradient-violet'
                            : 'text-white'}`}
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
            >
              {word}
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex items-center gap-4 mt-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            <p className="text-xs text-slate-400">Available for projects</p>
          </div>
          <div className="w-px h-4 bg-white/10"/>
          <p className="text-xs text-slate-600">Scroll to explore</p>
        </div>
      </motion.div>

      {/* ── Film frame corners ─────────────────────────────────────────── */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map(
        (pos, i) => (
          <div key={i}
               className={`absolute ${pos} w-6 h-6 border-white/20 pointer-events-none`}
               style={{
                 borderTop:    i < 2 ? '1px solid' : 'none',
                 borderBottom: i >= 2 ? '1px solid' : 'none',
                 borderLeft:   i % 2 === 0 ? '1px solid' : 'none',
                 borderRight:  i % 2 === 1 ? '1px solid' : 'none',
               }}/>
        )
      )}
    </section>
  );
};

// ── Stats bar ─────────────────────────────────────────────────────────────────
const StatsRow = () => (
  <section className="border-y border-white/[0.04] bg-night-800 relative
                       overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5
                    via-transparent to-cyan-600/5 pointer-events-none"/>
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={i}
            className={`py-12 px-6 text-center
              ${i < STATS.length - 1 ? 'border-r border-white/[0.04]' : ''}
              ${i < 2 ? 'border-b border-white/[0.04] lg:border-b-0' : ''}`}
          >
            <ScrollReveal variant="fadeUp" delay={i * 0.1}>
              <div className="font-display leading-none mb-2"
                   style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                <span className="text-gradient-violet">
                  <CountUp target={s.value} duration={2.5}/>
                </span>
              </div>
              <p className="text-xs text-slate-500 tracking-widest uppercase">
                {s.label}
              </p>
            </ScrollReveal>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Pull quote ────────────────────────────────────────────────────────────────
const PullQuote = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { backgroundPositionX: '0%' },
      {
        backgroundPositionX: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger:  el,
          start:    'top 70%',
          end:      'bottom 30%',
          scrub:    1,
        },
      }
    );

    return () => {
      anim.kill();
      anim.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section className="py-28 px-6 bg-night-900 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        {/* Decorative quotation mark */}
        <div className="font-display text-[8rem] text-violet-600/10 leading-none
                        mb-[-2rem] select-none">
          "
        </div>

        <ScrollReveal variant="fadeUp">
          <blockquote
            ref={ref}
            className="font-display text-white leading-tight uppercase
                       bg-gradient-to-r from-white via-violet-300 to-white
                       bg-clip-text text-transparent bg-[length:200%_100%]"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
          >
            I don't just cut footage together. I find the heartbeat of a story
            and build every frame around it.
          </blockquote>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.2}>
          <p className="text-slate-500 text-sm mt-8 tracking-widest uppercase">
            — The philosophy behind every edit
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ── Story — horizontal sticky scroll ─────────────────────────────────────────
const StorySection = () => {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    // Pin section while horizontally scrolling the track
    const anim = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth + 120),
      ease: 'none',
      scrollTrigger: {
        trigger:  section,
        pin:      true,
        scrub:    1,
        end:      () => `+=${track.scrollWidth - window.innerWidth + 120}`,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      anim.kill();
      anim.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-night-900">
      {/* Section label */}
      <div className="absolute top-8 left-6 z-10">
        <span className="section-tag">
          <span className="w-6 h-px bg-violet-400"/>
          The Journey
        </span>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex items-center gap-5 pl-6 pr-[120px]"
        style={{ height: '100vh', width: 'max-content' }}
      >
        {/* Intro card */}
        <div className="w-[40vw] min-w-[340px] max-w-[500px] shrink-0
                        flex flex-col justify-center">
          <h2 className="font-display uppercase text-white leading-[0.9]"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            5 years.<br/>
            <span className="text-gradient-violet">One story.</span>
          </h2>
          <p className="text-slate-500 text-sm mt-6 max-w-xs leading-relaxed">
            Drag or scroll to read through the journey — from a bedroom edit
            suite to international clients.
          </p>
          {/* Horizontal scroll arrow */}
          <div className="flex items-center gap-3 mt-8">
            <motion.div
              animate={{ x: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="flex items-center gap-2 text-violet-400"
            >
              <div className="h-px w-10 bg-violet-400"/>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <span className="text-xs text-slate-600">scroll →</span>
          </div>
        </div>

        {/* Chapter cards */}
        {STORY_CHAPTERS.map((chapter, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="w-[380px] shrink-0 h-[480px] glass rounded-2xl p-8
                       flex flex-col justify-between
                       hover:border-violet-500/20 transition-colors duration-300"
          >
            {/* Top */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-6xl text-gradient-violet
                                 opacity-30 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-xl text-violet-400">
                  {chapter.year}
                </span>
              </div>
              <h3 className="font-display text-2xl text-white uppercase mb-4">
                {chapter.label}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {chapter.body}
              </p>
            </div>

            {/* Bottom accent */}
            <div className="h-px bg-gradient-to-r from-violet-500/40
                            via-cyan-500/40 to-transparent"/>
          </motion.div>
        ))}

        {/* End card */}
        <div className="w-[320px] shrink-0 flex flex-col items-center
                        justify-center text-center gap-6">
          <div className="font-display text-7xl text-gradient-violet opacity-20
                          leading-none">
            ∞
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            The story doesn't end here. Every project adds a new chapter.
          </p>
          <MagneticButton>
            <Link to="/contact" className="btn-cta text-sm">
              Write the next chapter
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

// ── Specializations ───────────────────────────────────────────────────────────
const Specializations = () => (
  <section className="py-24 px-6 bg-night-800">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal variant="fadeUp" className="mb-14">
        <span className="section-tag">
          <span className="w-6 h-px bg-violet-400"/>
          What I do best
        </span>
        <h2 className="font-display text-title text-white uppercase mt-2">
          Specializations
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SPECIALIZATIONS.map((spec, i) => (
          <ScrollReveal key={i} variant="fadeUp" delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              className="glass p-8 rounded-2xl h-full group
                         hover:border-violet-500/20 transition-all duration-300
                         relative overflow-hidden"
            >
              {/* Background number */}
              <div className="absolute top-4 right-6 font-display text-8xl
                              text-white/[0.03] leading-none select-none
                              group-hover:text-white/[0.05] transition-colors">
                {spec.number}
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{ background: spec.color }}
                  />
                  <h3 className="font-display text-2xl text-white uppercase">
                    {spec.title}
                  </h3>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {spec.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {spec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-3 py-1.5 rounded-full uppercase
                                 tracking-wider font-medium"
                      style={{
                        background: `${spec.color}15`,
                        color:       spec.color,
                        border:      `1px solid ${spec.color}30`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

// ── Tools grid ────────────────────────────────────────────────────────────────
const ToolsGrid = () => (
  <section className="py-24 px-6 bg-night-900">
    <div className="max-w-7xl mx-auto">
      <ScrollReveal variant="fadeUp" className="text-center mb-14">
        <span className="section-tag justify-center">
          <span className="w-6 h-px bg-violet-400"/>
          The Toolkit
        </span>
        <h2 className="font-display text-title text-white uppercase">
          Software I Live In
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {TOOLS.map((tool, i) => (
          <ScrollReveal key={tool.name} variant="scaleUp" delay={i * 0.05}>
            <motion.div
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl p-5 flex flex-col items-center
                         gap-3 group cursor-default
                         hover:border-white/20 transition-all duration-300"
            >
              {/* App icon abbreviation */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center
                           font-bold text-sm tracking-tight"
                style={{
                  background:  `linear-gradient(135deg, ${tool.color}25, ${tool.color}10)`,
                  border:      `1px solid ${tool.color}30`,
                  color:        tool.color === '#FFFFFF' ? '#e2e8f0' : tool.color,
                  fontFamily:  'system-ui, sans-serif',
                }}
              >
                {tool.abbr}
              </div>
              <p className="text-[10px] text-slate-500 text-center
                            group-hover:text-slate-300 transition-colors
                            leading-tight font-medium">
                {tool.name}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      {/* Proficiency bar */}
      <ScrollReveal variant="fadeUp" delay={0.2}>
        <div className="mt-16 glass rounded-2xl p-8">
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-6">
            Core Proficiency
          </p>
          <div className="space-y-5">
            {[
              { name: 'Video Editing & Pacing', pct: 98 },
              { name: 'Color Grading',          pct: 92 },
              { name: 'Motion Graphics',        pct: 85 },
              { name: 'Sound Design',            pct: 80 },
              { name: 'VFX & Compositing',      pct: 72 },
            ].map((skill, i) => (
              <div key={skill.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-400">{skill.name}</p>
                  <p className="text-xs text-slate-600 group-hover:text-violet-400
                                transition-colors">
                    {skill.pct}%
                  </p>
                </div>
                <div className="h-px bg-white/5 rounded-full overflow-hidden">
                  <ScrollReveal variant="fadeIn" delay={i * 0.1}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: 'power2.out' }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #8b5cf6, #06b6d4)`,
                      }}
                    />
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

// ── Client logos marquee ──────────────────────────────────────────────────────
const ClientLogos = () => (
  <section className="py-20 bg-night-800 border-y border-white/[0.04]">
    <ScrollReveal variant="fadeUp" className="text-center mb-12 px-6">
      <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">
        Trusted by brands worldwide
      </p>
    </ScrollReveal>

    {/* Marquee of client names */}
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        className="inline-flex gap-16 items-center"
      >
        {[...CLIENTS, ...CLIENTS].map((client, i) => (
          <span
            key={i}
            className="font-display text-2xl text-white/10 hover:text-white/30
                       transition-colors duration-300 cursor-default uppercase
                       tracking-widest"
          >
            {client}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

// ── The approach section ──────────────────────────────────────────────────────
const TheApproach = () => {
  const items = [
    {
      title: 'Listen first',
      body:  'Before a single clip is loaded, I spend time understanding your audience, your goal, and what success actually looks like for this project.',
      num:   '01',
    },
    {
      title: 'Build structure',
      body:  'A great edit has architecture. I map out the emotional arc before touching the timeline — because structure is what makes the difference between watchable and unforgettable.',
      num:   '02',
    },
    {
      title: 'Edit with intention',
      body:  'Every cut, every transition, every music choice is a decision. I don\'t edit on autopilot. Each frame has a reason to be there.',
      num:   '03',
    },
    {
      title: 'Deliver with care',
      body:  'Revisions without ego, communication without jargon, files delivered on time. The experience of working together matters as much as the final product.',
      num:   '04',
    },
  ];

  return (
    <section className="py-24 px-6 bg-night-900">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fadeUp" className="mb-16">
          <span className="section-tag">
            <span className="w-6 h-px bg-violet-400"/>
            How I think
          </span>
          <h2 className="font-display text-title text-white uppercase mt-2">
            The Approach
          </h2>
        </ScrollReveal>

        <div className="space-y-0">
          {items.map((item, i) => (
            <ScrollReveal key={i} variant="fadeUp" delay={i * 0.08}>
              <motion.div
                whileHover={{ backgroundColor: 'rgba(139,92,246,0.03)' }}
                className="group border-b border-white/[0.05] py-8
                           flex flex-col sm:flex-row gap-6 sm:gap-12
                           items-start cursor-default transition-colors duration-300"
              >
                {/* Number */}
                <span className="font-display text-5xl text-white/10
                                 group-hover:text-violet-600/30 transition-colors
                                 duration-300 shrink-0 leading-none w-16">
                  {item.num}
                </span>

                {/* Title */}
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase
                               group-hover:text-gradient-violet transition-all
                               duration-300 sm:w-64 shrink-0 leading-tight mt-1">
                  {item.title}
                </h3>

                {/* Body */}
                <p className="text-slate-500 text-sm leading-relaxed flex-1
                              group-hover:text-slate-400 transition-colors duration-300
                              max-w-xl">
                  {item.body}
                </p>

                {/* Arrow */}
                <motion.div
                  className="shrink-0 text-violet-600/0 group-hover:text-violet-400
                             transition-all duration-300 mt-1"
                  animate={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth={1.5} className="w-5 h-5">
                    <path d="M5 12h14M12 5l7 7-7 7"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Final CTA ─────────────────────────────────────────────────────────────────
const FinalCTA = () => (
  <section className="relative py-40 px-6 overflow-hidden bg-night-900">
    {/* Large ambient glow */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-3xl"
      />
    </div>

    {/* Decorative lines */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24
                    bg-gradient-to-b from-transparent to-violet-500/40"/>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24
                    bg-gradient-to-t from-transparent to-violet-500/40"/>

    <div className="relative max-w-4xl mx-auto text-center">
      <ScrollReveal variant="fadeUp">
        <p className="text-violet-400 text-xs tracking-[0.4em] uppercase mb-6">
          Let's make something
        </p>

        <h2 className="font-display text-white uppercase leading-[0.9] mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
          Ready when
          <br/>
          <span className="text-gradient-violet">you are.</span>
        </h2>

        <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed mb-12">
          Whether you have a full brief or just an idea scribbled on a napkin —
          reach out. The best projects start with a conversation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MagneticButton strength={0.25}>
            <Link to="/contact" className="btn-cta px-10 py-4">
              Start a project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </MagneticButton>
          <MagneticButton strength={0.2}>
            <Link to="/portfolio" className="btn-outline px-10 py-4">
              See the work first
            </Link>
          </MagneticButton>
        </div>

        {/* Social proof micro-line */}
        <p className="text-slate-700 text-xs mt-10">
          Typically responds within 12 hours · Currently accepting projects
        </p>
      </ScrollReveal>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

const About = () => {
  const { settings } = useSite();

  return (
    <>
      <Helmet>
        <title>About — {settings.siteTitle || 'CineEdit'}</title>
        <meta
          name="description"
          content="Professional video editor — 5+ years, 150+ projects, cinematic storytelling for brands and creators worldwide."
        />
      </Helmet>

      <NoiseOverlay opacity={0.035} zIndex={999} fixed/>

      {/* Full-bleed video hero */}
      <AboutHero showreelUrl={settings.showreelUrl}/>

      {/* Stats numbers */}
      <StatsRow/>

      {/* Client names marquee */}
      <ClientLogos/>

      {/* The pull quote */}
      <PullQuote/>

      {/* Horizontal story scroll */}
      <StorySection/>

      {/* Specialization cards */}
      <Specializations/>

      {/* The approach — numbered list */}
      <TheApproach/>

      {/* Marquee separator */}
      <MarqueeBar
        speed={30}
        items={[
          'Brand Storytelling', 'YouTube Content', 'Documentary',
          'Color Grading', 'Motion Graphics', 'Cinematic Ads',
          'Sound Design', 'Short-Form', 'Long-Form',
        ]}
        dark
      />

      {/* Tools */}
      <ToolsGrid/>

      {/* Final CTA */}
      <FinalCTA/>
    </>
  );
};

export default About;