import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';

const STATS = [
  { value: '50+', label: 'Projects Completed' },
  { value: '2+', label: 'Years of Experience' },
  { value: '20+', label: 'Happy Clients' },
];

const SPECIALIZATIONS = [
  {
    number: '01',
    title: 'YouTube Editing',
    desc: 'Clean edits focused on storytelling, pacing, and audience retention.',
    tags: ['Talking Head', 'Long-form', 'Retention Focus'],
  },
  {
    number: '02',
    title: 'Short-Form Content',
    desc: 'Fast, engaging edits built for Reels, Shorts, and social platforms.',
    tags: ['Reels', 'Shorts', 'TikTok'],
  },
  {
    number: '03',
    title: 'Basic Motion & Polish',
    desc: 'Motion graphics, sound cleanup, and color polish that make content feel more professional.',
    tags: ['Motion Graphics', 'Color', 'Sound'],
  },
];

const TOOLS = [
  { name: 'Premiere Pro', abbr: 'Pr', color: '#9999FF' },
  { name: 'After Effects', abbr: 'Ae', color: '#9999FF' },
  { name: 'Photoshop', abbr: 'Ps', color: '#31A8FF' },
  { name: 'DaVinci Resolve', abbr: 'DV', color: '#E8872B' },
];

const WORK_STYLE = [
  'Clear communication throughout the project',
  'Fast turnaround with attention to detail',
  'Open to revisions and feedback',
  'Focused on content that performs and looks clean',
];

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-night-900 px-6 pt-32 pb-20 md:pt-36 md:pb-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-violet-600/12 blur-3xl" />
        <div className="absolute right-0 top-24 h-[240px] w-[240px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_34%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
            <span className="h-px w-5 bg-violet-400" />
            About Me
          </span>

          <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] text-white md:text-6xl">
            Video editing focused on
            <span className="block bg-gradient-to-r from-violet-300 to-indigo-400 bg-clip-text text-transparent">
              clean storytelling & growth
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            I’m an intermediate video editor who helps creators, coaches, and growing
            brands turn raw footage into polished content. My focus is simple:
            stronger pacing, cleaner visuals, and edits that feel professional without
            overcomplicating the message.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
            >
              View my work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="border-y border-white/[0.05] bg-night-800 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center"
            >
              <div className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-400">
                {stat.value}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutContent = () => {
  return (
    <section className="bg-night-900 px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
            <span className="h-px w-5 bg-violet-400" />
            Who I Am
          </span>

          <h2 className="mt-5 font-display text-3xl uppercase leading-tight text-white md:text-4xl">
            A growing editor with a practical,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-400">
              creator-first workflow
            </span>
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-400 md:text-base">
            <p>
              I work mainly on YouTube videos, short-form content, and branded edits.
              My approach is less about flashy effects and more about making content
              feel sharp, watchable, and well-paced.
            </p>
            <p>
              I’m still growing, which means I bring both hunger and attention to the
              work. I care about the final result, I listen closely to feedback, and I
              try to make the editing process easy for the client.
            </p>
            <p>
              Whether it’s a talking-head video, social clip, or content package for a
              brand, I aim to deliver edits that look clean, communicate clearly, and
              help the content perform better.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            What it’s like working with me
          </p>

          <div className="mt-6 space-y-4">
            {WORK_STYLE.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                <p className="text-sm leading-relaxed text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-violet-500/15 bg-violet-500/[0.08] p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300">
              Best fit for
            </p>
            <p className="mt-2 text-sm leading-relaxed text-violet-100">
              Creators, coaches, and small brands who want polished edits, reliable
              communication, and content that feels more professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SpecializationsSection = () => {
  return (
    <section className="bg-night-800 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={staggerItem} className="mb-14 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
              <span className="h-px w-5 bg-violet-400" />
              What I Do Best
            </span>

            <h2 className="mt-5 font-display text-3xl uppercase leading-tight text-white md:text-4xl">
              Services I’m strongest in
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
              I keep my focus on the types of editing where I can deliver the best
              value consistently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SPECIALIZATIONS.map((spec) => (
              <motion.div
                key={spec.number}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/25 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
              >
                <div className="absolute right-5 top-4 font-display text-6xl leading-none text-white/[0.04]">
                  {spec.number}
                </div>

                <div className="relative z-10">
                  <h3 className="font-display text-2xl uppercase text-white">
                    {spec.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {spec.desc}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {spec.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-violet-500/15 bg-violet-500/[0.08] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-violet-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ToolsSection = () => {
  return (
    <section className="bg-night-900 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
            <span className="h-px w-5 bg-violet-400" />
            Toolkit
          </span>

          <h2 className="mt-5 font-display text-3xl uppercase text-white md:text-4xl">
            Tools I work with
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center backdrop-blur-xl transition-all duration-300 hover:border-violet-500/20"
            >
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${tool.color}25, ${tool.color}10)`,
                  border: `1px solid ${tool.color}30`,
                  color: tool.color === '#FFFFFF' ? '#e2e8f0' : tool.color,
                }}
              >
                {tool.abbr}
              </div>

              <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                {tool.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-night-900 px-6 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-12 text-center backdrop-blur-xl md:px-10">
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
          <span className="h-px w-5 bg-violet-400" />
          Let’s Work Together
        </span>

        <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] text-white md:text-5xl">
          Ready to improve your
          <span className="block bg-gradient-to-r from-violet-300 to-indigo-400 bg-clip-text text-transparent">
            video content?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
          If you need clean editing, better pacing, and a smoother workflow, let’s
          talk about your next project.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
          >
            View my work
          </Link>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { settings } = useSite();

  return (
    <>
      <Helmet>
        <title>About — {settings.siteTitle || 'VickyVfx'}</title>
        <meta
          name="description"
          content="Intermediate video editor creating polished YouTube videos, short-form content, and branded edits for creators and growing businesses."
        />
      </Helmet>

      <AboutHero />
      <StatsSection />
      <AboutContent />
      <SpecializationsSection />
      <ToolsSection />
      <FinalCTA />
    </>
  );
};

export default About;