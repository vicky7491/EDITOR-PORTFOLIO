import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSite } from '@/context/SiteContext';
import ScrollReveal    from '@/components/animations/ScrollReveal';
import TextReveal      from '@/components/animations/TextReveal';
import ParallaxSection from '@/components/animations/ParallaxSection';
import MagneticButton  from '@/components/animations/MagneticButton';
import Timeline        from '@/components/about/Timeline';
import { Link } from 'react-router-dom';

const TOOLS = [
  'Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve',
  'Final Cut Pro', 'Cinema 4D', 'Adobe Audition',
  'Photoshop', 'Illustrator', 'Frame.io', 'Notion',
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'Deep-diving into your brand, audience, and goals to set the perfect creative direction.',
    icon: '🎯',
  },
  {
    step: '02',
    title: 'Strategy',
    desc: 'Building a clear editorial roadmap — structure, pacing, tone, and storytelling arc.',
    icon: '🗺️',
  },
  {
    step: '03',
    title: 'Editing',
    desc: 'Frame-perfect cuts, color grading, sound design, and motion graphics that elevate.',
    icon: '✂️',
  },
  {
    step: '04',
    title: 'Delivery',
    desc: 'Multiple formats optimized for your platform — YouTube, Instagram, broadcast, or web.',
    icon: '🚀',
  },
];

const About = () => {
  const { settings } = useSite();

  return (
    <>
      <Helmet>
        <title>About — {settings.siteTitle || 'CineEdit'}</title>
        <meta name="description"
              content="The story behind CineEdit — professional video editor crafting cinematic stories."/>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex items-end pb-16 pt-36
                          bg-night-900 overflow-hidden">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-3xl"/>
        </div>

        {/* Decorative number */}
        <div className="absolute right-8 top-24 font-display text-[12rem] text-white/[0.02]
                        leading-none select-none pointer-events-none hidden xl:block">
          01
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <ScrollReveal variant="slideRight">
            <span className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              About Me
            </span>
          </ScrollReveal>

          <TextReveal
            as="h1"
            className="font-display text-title text-white uppercase mt-4"
            delay={0.2}
            trigger={false}
          >
            Crafting Stories Frame by Frame
          </TextReveal>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div className="space-y-6">
            <ScrollReveal variant="slideRight">
              <span className="section-tag">
                <span className="w-6 h-px bg-violet-400"/>
                My Story
              </span>
              <h2 className="font-display text-4xl text-white uppercase mt-2">
                The Editor Behind the Lens
              </h2>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.1}>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  {settings.aboutPreview ||
                    `I'm a professional video editor with a passion for transforming
                     raw footage into compelling visual narratives. Every frame tells a
                     story — and I make sure yours is told perfectly.`}
                </p>
                <p>
                  From documentary-style corporate films to high-energy social content,
                  I bring technical precision and artistic intuition to every project.
                  My work spans brands, creators, and agencies across the globe.
                </p>
                <p>
                  When I'm not in the edit suite, I'm studying cinema, exploring new
                  techniques, and constantly pushing the boundaries of what's possible
                  with motion and sound.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.2}>
              <div className="flex gap-4 pt-2">
                <MagneticButton>
                  <Link to="/portfolio" className="btn-cta">View my work</Link>
                </MagneticButton>
                <MagneticButton>
                  <Link to="/contact" className="btn-outline">Get in touch</Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>

          {/* Visual */}
          <ParallaxSection speed={0.15}>
            <ScrollReveal variant="scaleUp" delay={0.1}>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl glass overflow-hidden neon-border">
                  <div className="absolute inset-0 bg-gradient-to-br
                                  from-violet-600/15 to-cyan-600/8"/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-display text-9xl text-gradient-violet
                                      leading-none mb-3">5+</div>
                      <p className="text-slate-400 text-sm tracking-widest uppercase">
                        Years of Experience
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating stat 1 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 glass p-5 rounded-2xl
                             shadow-xl shadow-black/40"
                >
                  <p className="font-display text-3xl text-gradient-violet">150+</p>
                  <p className="text-xs text-slate-500 mt-1">Projects Delivered</p>
                </motion.div>

                {/* Floating stat 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-4 -right-4 glass p-4 rounded-2xl
                             shadow-xl shadow-black/40"
                >
                  <p className="font-display text-2xl text-gradient-violet">98%</p>
                  <p className="text-xs text-slate-500 mt-0.5">Client satisfaction</p>
                </motion.div>
              </div>
            </ScrollReveal>
          </ParallaxSection>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fadeUp" className="text-center mb-16">
            <span className="section-tag justify-center">
              <span className="w-6 h-px bg-violet-400"/>
              How I Work
            </span>
            <h2 className="font-display text-title text-white uppercase">
              My Creative Process
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.step} variant="fadeUp" delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, borderColor: 'rgba(139,92,246,0.25)' }}
                  className="glass p-6 h-full transition-colors duration-300"
                >
                  <div className="font-display text-5xl text-gradient-violet
                                  opacity-30 mb-4 leading-none">
                    {step.step}
                  </div>
                  <h3 className="font-display text-xl text-white uppercase mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="section">
        <ScrollReveal variant="fadeUp" className="text-center mb-16">
          <span className="section-tag justify-center">
            <span className="w-6 h-px bg-violet-400"/>
            Journey
          </span>
          <h2 className="font-display text-title text-white uppercase">
            Milestones
          </h2>
        </ScrollReveal>

        <Timeline/>
      </section>

      {/* ── Tools ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fadeUp" className="text-center mb-12">
            <span className="section-tag justify-center">
              <span className="w-6 h-px bg-violet-400"/>
              My Arsenal
            </span>
            <h2 className="font-display text-title text-white uppercase">
              Tools &amp; Software
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {TOOLS.map((tool, i) => (
                <motion.div
                  key={tool}
                  whileHover={{ y: -4, borderColor: 'rgba(139,92,246,0.4)' }}
                  transition={{ duration: 0.2 }}
                  className="glass px-5 py-3 rounded-full text-sm text-slate-400
                             hover:text-violet-400 transition-colors duration-300
                             cursor-default"
                >
                  {tool}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-night-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-violet-600/8 rounded-full blur-3xl"/>
        </div>
        <ScrollReveal variant="fadeUp" className="relative max-w-2xl mx-auto">
          <h2 className="font-display text-4xl text-white uppercase mb-4">
            Ready to work together?
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Let's turn your vision into a cinematic reality.
          </p>
          <MagneticButton>
            <Link to="/contact" className="btn-cta">
              Start a conversation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </MagneticButton>
        </ScrollReveal>
      </section>
    </>
  );
};

export default About;