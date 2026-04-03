import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useSite } from '@/context/SiteContext';
import useInView from '@/hooks/useInView';
import { staggerContainer, staggerItem, fadeUp, slideRight } from '@/utils/motion';

const TOOLS = [
  'Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve',
  'Final Cut Pro', 'Cinema 4D', 'Audition', 'Photoshop', 'Illustrator',
];

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery',   desc: 'Understanding your vision, brand, and target audience to set the creative direction.' },
  { step: '02', title: 'Strategy',    desc: 'Building a clear editorial roadmap — structure, pacing, tone, and storytelling arc.' },
  { step: '03', title: 'Editing',     desc: 'Frame-perfect cuts, color grading, sound design, and motion graphics.' },
  { step: '04', title: 'Delivery',    desc: 'Multiple formats optimized for your platform — YouTube, Instagram, broadcast, or web.' },
];

const About = () => {
  const { settings } = useSite();
  const [heroRef,    heroInView]    = useInView();
  const [processRef, processInView] = useInView();
  const [toolsRef,   toolsInView]   = useInView();

  return (
    <>
      <Helmet>
        <title>About — {settings.siteTitle || 'CineEdit'}</title>
        <meta name="description" content="The story behind CineEdit — professional video editor."/>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end pb-16 pt-32 px-6
                          bg-night-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/10
                        via-transparent to-transparent pointer-events-none"/>
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            ref={heroRef}
            variants={staggerContainer}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
          >
            <motion.span variants={staggerItem} className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              About Me
            </motion.span>
            <motion.h1
              variants={staggerItem}
              className="font-display text-title text-white uppercase max-w-3xl"
            >
              Crafting Stories{' '}
              <span className="text-gradient-violet">Frame by Frame</span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5"
          >
            <span className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              My Story
            </span>
            <h2 className="font-display text-4xl text-white uppercase">
              The Editor Behind the Lens
            </h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                {settings.aboutPreview ||
                  `I'm a professional video editor with a passion for transforming raw footage
                   into compelling visual narratives. Every frame tells a story — and I make
                   sure yours is told perfectly.`}
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
          </motion.div>

          {/* Visual side */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl glass overflow-hidden
                            neon-border relative">
              <div className="absolute inset-0 bg-gradient-to-br
                              from-violet-600/20 to-cyan-600/10"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-8xl text-gradient-violet mb-2">
                    5+
                  </div>
                  <p className="text-slate-400 text-sm tracking-widest uppercase">
                    Years of Experience
                  </p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl"
            >
              <p className="font-display text-3xl text-gradient-violet">150+</p>
              <p className="text-xs text-slate-500 mt-0.5">Projects Delivered</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section ref={processRef}
               className="py-24 px-6 bg-night-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="section-tag justify-center">
              <span className="w-6 h-px bg-violet-400"/>
              How I Work
            </span>
            <h2 className="font-display text-title text-white uppercase">
              My Creative Process
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="glass p-6 group hover:border-violet-500/20
                           transition-all duration-300"
              >
                <div className="font-display text-5xl text-gradient-violet
                                opacity-40 mb-4 group-hover:opacity-70
                                transition-opacity">
                  {step.step}
                </div>
                <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ─────────────────────────────────────────────────────────── */}
      <section ref={toolsRef} className="section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={toolsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-tag justify-center">
            <span className="w-6 h-px bg-violet-400"/>
            My Arsenal
          </span>
          <h2 className="font-display text-title text-white uppercase">
            Tools & Software
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={toolsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ y: -3, borderColor: 'rgba(139,92,246,0.4)' }}
              className="glass px-5 py-2.5 rounded-full text-sm text-slate-400
                         hover:text-violet-400 transition-all duration-300"
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;