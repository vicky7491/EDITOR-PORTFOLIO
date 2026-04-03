import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useInView from '@/hooks/useInView';

const ContactCTA = () => {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-night-900"
    >
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-3xl"/>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center relative"
      >
        <span className="section-tag justify-center">
          <span className="w-6 h-px bg-violet-400"/>
          Let's Collaborate
        </span>
        <h2 className="font-display text-title text-white uppercase mb-5">
          Ready to Create Something{' '}
          <span className="text-gradient-violet">Extraordinary?</span>
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
          Whether you need a YouTube edit, brand commercial, or documentary —
          let's bring your vision to life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact" className="btn-cta">
            Start a project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={1.5} className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link to="/portfolio" className="btn-outline">
            View my work
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactCTA;