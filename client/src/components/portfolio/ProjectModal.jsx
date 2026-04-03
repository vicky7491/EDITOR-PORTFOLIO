// Quick-view modal for a project — opened from portfolio grid
// Shows key info + video/image without navigating away

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import BeforeAfterSlider from './BeforeAfterSlider';

const ProjectModal = ({ project, isOpen, onClose }) => {
  // Lock scroll and handle Escape
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', fn);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const hasBeforeAfter =
    project.beforeAfter?.before?.url && project.beforeAfter?.after?.url;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
                       glass border border-white/[0.07] rounded-2xl
                       shadow-2xl shadow-black/60"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full
                         bg-black/50 text-white hover:bg-black/70
                         transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1.5} className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Media */}
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                poster={project.thumbnail?.url}
                controls
                playsInline
                className="w-full aspect-video object-cover rounded-t-2xl bg-black"
              />
            ) : project.thumbnail?.url ? (
              <img
                src={project.thumbnail.url}
                alt={project.title}
                className="w-full aspect-video object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full aspect-video bg-night-800 rounded-t-2xl
                              flex items-center justify-center text-night-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1} className="w-12 h-12">
                  <rect x="2" y="7" width="20" height="15" rx="2"/>
                  <polyline points="17 2 12 7 7 2"/>
                </svg>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Category + badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.category && (
                  <Badge
                    color="custom"
                    customColor={project.category.color}
                    size="xs"
                  >
                    {project.category.name}
                  </Badge>
                )}
                {project.featured && (
                  <Badge color="gold" size="xs">★ Featured</Badge>
                )}
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl text-white uppercase mb-2">
                {project.title}
              </h2>

              {/* Short description */}
              {project.shortDescription && (
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.shortDescription}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 mb-5 text-xs text-slate-500">
                {project.clientName && (
                  <span>Client: <span className="text-slate-300">{project.clientName}</span></span>
                )}
                {project.projectDate && (
                  <span>Year: <span className="text-slate-300">
                    {new Date(project.projectDate).getFullYear()}
                  </span></span>
                )}
                {project.views > 0 && (
                  <span>{project.views.toLocaleString()} views</span>
                )}
              </div>

              {/* Software tags */}
              {project.softwareUsed?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.softwareUsed.map((sw) => (
                    <span key={sw}
                          className="text-[10px] text-slate-500 px-2.5 py-1
                                     rounded-full glass border border-white/5">
                      {sw}
                    </span>
                  ))}
                </div>
              )}

              {/* Before / After */}
              {hasBeforeAfter && (
                <div className="mb-5">
                  <p className="text-xs text-slate-600 uppercase tracking-widest mb-3">
                    Before / After
                  </p>
                  <BeforeAfterSlider
                    beforeUrl={project.beforeAfter.before.url}
                    afterUrl={project.beforeAfter.after.url}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <Link
                  to={`/portfolio/${project.slug}`}
                  onClick={onClose}
                  className="btn-cta text-sm"
                >
                  View full project
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth={1.5} className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                {project.externalLink && (
                  <a
                    href={project.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm"
                  >
                    Live link ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;