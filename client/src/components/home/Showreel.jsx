import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import useInView from "@/hooks/useInView";
import VideoEmbed from "@/components/ui/VideoEmbed";

const Showreel = () => {
  const { settings } = useSite();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [ref, inView] = useInView();

  const showreelUrl = settings?.showreelUrl;

 if (settings && !settings.showShowreelSection) return null;

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <section ref={ref} className="section-py relative overflow-hidden">
      {/* Ambient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px
                      bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"
      />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="section-label">
            <span className="w-6 h-px bg-brand-400 inline-block" />
            Showreel
          </p>
          <h2 className="section-title">
            Watch the <span className="text-gradient">Latest Work</span>
          </h2>
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden
                     border border-white/10 shadow-2xl shadow-brand-600/10
                     aspect-video bg-dark-900"
        >
          {showreelUrl ? (
            <>
              {!playing && (
                <div className="absolute inset-0 bg-dark-900 z-10">
                  {/* Thumbnail gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br
                                  from-brand-900/40 to-dark-950"
                  />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={handlePlay}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      data-cursor="Play"
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm
                                 border border-white/20 flex items-center justify-center
                                 hover:bg-brand-600/30 hover:border-brand-500/50
                                 transition-all duration-300
                                 shadow-2xl shadow-black/50 group"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-8 h-8 ml-1"
                      >
                        <polygon
                          points="5 3 19 12 5 21 5 3"
                          className="fill-white group-hover:fill-brand-300
                                            transition-colors duration-300"
                        />
                      </svg>
                    </motion.button>
                  </div>
                  {/* "Showreel" label */}
                  <div className="absolute bottom-6 left-6">
                    <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                      2024 Showreel
                    </p>
                  </div>
                </div>
              )}
              <VideoEmbed
                url={settings.showreelUrl}
                title="Showreel"
                controls
                playButton={!playing}
                onPlay={() => setPlaying(true)}
                className="w-full h-full rounded-none"
              />
            </>
          ) : (
            /* Placeholder if no URL set yet */
            <div
              className="absolute inset-0 flex items-center justify-center
                            bg-gradient-to-br from-brand-900/20 to-dark-900"
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-full border-2 border-brand-500/30
                                flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-7 h-7 text-brand-400"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">Showreel coming soon</p>
              </div>
            </div>
          )}

          {/* Decorative corner accents */}
          <div
            className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2
                          border-brand-500/50 rounded-tl-2xl pointer-events-none"
          />
          <div
            className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2
                          border-brand-500/50 rounded-tr-2xl pointer-events-none"
          />
          <div
            className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2
                          border-brand-500/50 rounded-bl-2xl pointer-events-none"
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2
                          border-brand-500/50 rounded-br-2xl pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Showreel;
