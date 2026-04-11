import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

import { getProjects } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';
import ProjectCard from '@/components/portfolio/ProjectCard';

const Portfolio = () => {
  const { settings } = useSite();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    getProjects({ page, limit: 9, sort: '-createdAt' })
      .then((r) => {
        const nextProjects = r.data.data || [];
        if (page === 1) {
          setProjects(nextProjects);
        } else {
          setProjects((prev) => [...prev, ...nextProjects]);
        }
        setMeta(r.data.meta || null);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <>
      <Helmet>
        <title>Portfolio — {settings.siteTitle || 'CineEdit'}</title>
        <meta
          name="description"
          content="Browse my portfolio of editing projects for creators and brands."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-night-900 px-6 pt-32 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[340px] w-[340px] rounded-full bg-violet-600/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_34%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-violet-300">
              <span className="w-5 h-px bg-violet-400" />
              My Work
            </span>

            <h1 className="mt-5 font-display text-4xl md:text-6xl uppercase leading-[0.95] text-white">
              Portfolio that blends
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-400">
                storytelling and style
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm md:text-base leading-relaxed text-slate-400">
              A selection of projects across YouTube edits, short-form content,
              and branded visuals — built to look clean, engaging, and modern.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-night-900 px-6 py-14">
        <div className="max-w-7xl mx-auto">
          {meta?.totalDocs ? (
            <div className="mb-8">
              <p className="text-sm text-slate-500">
                Showing <span className="text-white">{projects.length}</span> of{' '}
                <span className="text-white">{meta.totalDocs}</span> projects
              </p>
            </div>
          ) : null}

          {isLoading && page === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <div className="aspect-[9/16] rounded-2xl bg-night-800 animate-pulse" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-night-800 animate-pulse" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-night-800 animate-pulse" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] px-6 py-20 text-center backdrop-blur-xl">
              <p className="text-lg text-white">No projects found</p>
              <p className="mt-2 text-sm text-slate-500">
                Projects will appear here once they are added.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {projects.map((project, i) => (
                <motion.div key={project._id} variants={staggerItem}>
                  <ProjectCard
                    project={project}
                    index={i}
                    onOpen={() => setActiveProject(project)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {meta?.hasNextPage && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10 px-6 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Loading...' : 'Load more projects'}
              </button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setActiveProject(null)}
          >
            <div className="flex min-h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md"
              >
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute -top-12 right-0 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
                >
                  Close
                </button>

                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-night-900 shadow-2xl">
                  {activeProject.videoUrl ? (
                    <video
                      src={activeProject.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full max-h-[85vh] bg-black object-contain"
                    />
                  ) : activeProject.thumbnail?.url ? (
                    <img
                      src={activeProject.thumbnail.url}
                      alt={activeProject.title}
                      className="w-full max-h-[85vh] bg-black object-contain"
                    />
                  ) : null}

                  <div className="p-5">
                    {activeProject.category && (
                      <span
                        className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-wider"
                        style={{
                          background: `${activeProject.category.color}18`,
                          color: activeProject.category.color,
                          border: `1px solid ${activeProject.category.color}35`,
                        }}
                      >
                        {activeProject.category.name}
                      </span>
                    )}

                    <h3 className="font-display text-2xl text-white uppercase">
                      {activeProject.title}
                    </h3>

                    {activeProject.shortDescription && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">
                        {activeProject.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;