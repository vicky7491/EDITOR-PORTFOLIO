import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt,    setTilt]    = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <Link to={`/portfolio/${project.slug}`}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.y * -6,
          rotateY: tilt.x * 6,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ transformPerspective: 1000 }}
        className="project-card group"
      >
        {/* Thumbnail */}
        <div className="aspect-[16/10] overflow-hidden bg-night-800">
          {project.thumbnail?.url ? (
            <motion.img
              src={project.thumbnail.url}
              alt={project.title}
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center
                            text-night-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1} className="w-12 h-12">
                <rect x="2" y="7" width="20" height="15" rx="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </svg>
            </div>
          )}

          {/* Play overlay on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-night-900/60 flex items-center
                       justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-violet-600/90
                            flex items-center justify-center
                            shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-5">
          {/* Category + Featured badge */}
          <div className="flex items-center gap-2 mb-3">
            {project.category && (
              <span
                className="text-[10px] font-medium px-2.5 py-1 rounded-full
                           tracking-wider uppercase"
                style={{
                  background: `${project.category.color}18`,
                  color:       project.category.color,
                  border:      `1px solid ${project.category.color}35`,
                }}
              >
                {project.category.name}
              </span>
            )}
            {project.featured && (
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-full
                               bg-gold-400/10 text-gold-400 border border-gold-400/20
                               tracking-wider uppercase">
                Featured
              </span>
            )}
          </div>

          <h3 className="font-display text-lg text-white mb-1.5 group-hover:text-violet-300
                         transition-colors duration-300 line-clamp-1">
            {project.title}
          </h3>

          {project.shortDescription && (
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {project.shortDescription}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-1">
              {project.softwareUsed?.slice(0, 2).map((sw) => (
                <span key={sw} className="text-[10px] text-slate-600 px-2 py-0.5
                                          rounded border border-white/5">
                  {sw}
                </span>
              ))}
            </div>
            {project.projectDate && (
              <span className="text-xs text-slate-600">
                {new Date(project.projectDate).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProjectCard;