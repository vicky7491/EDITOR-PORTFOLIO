import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useInView from '@/hooks/useInView';

const ContactCTA = () => {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-night-900 px-6 py-28 md:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/12 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.10),transparent_38%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
          <span className="h-px w-5 bg-violet-400" />
          Let’s Collaborate
        </span>

        <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] text-white md:text-6xl">
          Ready to turn ideas into
          <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
            standout content?
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
          Whether you need short-form edits, branded content, or a full creative
          partner for your next launch, I’ll help you create visuals that feel
          sharp, cinematic, and built to perform.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/40 active:scale-[0.98]"
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
      </motion.div>
    </section>
  );
};

export default ContactCTA;