import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, index = 0, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [canPreview, setCanPreview] = useState(false);
  const videoRef = useRef(null);

  const hasVideoPreview = Boolean(project.videoUrl);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  const handleMouseEnter = async () => {
    setHovered(true);

    if (!hasVideoPreview || !videoRef.current) return;

    try {
      setCanPreview(true);
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
    } catch {
      setCanPreview(false);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="block w-full text-left"
    >
      <motion.div
        animate={{
          rotateX: tilt.y * -6,
          rotateY: tilt.x * 6,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ transformPerspective: 1000 }}
        className="group mx-auto max-w-[280px] overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 hover:border-violet-500/25 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]"
      >
        <div className="relative aspect-[9/16] overflow-hidden bg-night-800">
          {project.thumbnail?.url ? (
            <motion.img
              src={project.thumbnail.url}
              alt={project.title}
              animate={{
                scale: hovered ? 1.04 : 1,
                opacity: hovered && hasVideoPreview && canPreview ? 0 : 1,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-night-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className="h-12 w-12"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            </div>
          )}

          {hasVideoPreview && (
            <video
              ref={videoRef}
              src={project.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.thumbnail?.url}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                hovered && canPreview ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadedData={() => setCanPreview(true)}
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />

          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center bg-night-900/20"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600/90 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <svg viewBox="0 0 24 24" fill="white" className="ml-0.5 h-6 w-6">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </motion.div>

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {project.category && (
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    background: `${project.category.color}22`,
                    color: project.category.color,
                    border: `1px solid ${project.category.color}35`,
                  }}
                >
                  {project.category.name}
                </span>
              )}

              {project.featured && (
                <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-violet-300">
                  Featured
                </span>
              )}
            </div>

            <h3 className="line-clamp-2 font-display text-base uppercase text-white transition-colors duration-300 group-hover:text-violet-200">
              {project.title}
            </h3>
          </div>
        </div>
      </motion.div>
    </button>
  );
};

export default ProjectCard;