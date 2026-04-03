import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

import { getProjects, getCategories } from '@/api/publicApi';
import { useSite } from '@/context/SiteContext';
import { staggerContainer, staggerItem } from '@/utils/motion';
import ProjectCard    from '@/components/portfolio/ProjectCard';
import ProjectFilter  from '@/components/portfolio/ProjectFilter';
import useInView      from '@/hooks/useInView';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt',  label: 'Oldest first' },
  { value: 'order',      label: 'Featured order' },
];

const Portfolio = () => {
  const { settings }  = useSite();
  const [projects,    setProjects]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [page,        setPage]        = useState(1);
  const [meta,        setMeta]        = useState(null);
  const [category,    setCategory]    = useState('');
  const [sort,        setSort]        = useState('-createdAt');
  const [search,      setSearch]      = useState('');
  const [inputSearch, setInputSearch] = useState('');
  const [ref, inView] = useInView();

  // Fetch categories once
  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.data || []));
  }, []);

  // Fetch projects when filters change
  useEffect(() => {
    setIsLoading(true);
    getProjects({ page, limit: 9, category, sort, search })
      .then((r) => {
        if (page === 1) {
          setProjects(r.data.data || []);
        } else {
          setProjects((prev) => [...prev, ...(r.data.data || [])]);
        }
        setMeta(r.data.meta);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page, category, sort, search]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setProjects([]);
  };

  const handleSearch = () => {
    setSearch(inputSearch);
    setPage(1);
    setProjects([]);
  };

  return (
    <>
      <Helmet>
        <title>Portfolio — {settings.siteTitle || 'CineEdit'}</title>
        <meta name="description" content="Browse my portfolio of cinematic video editing projects."/>
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-night-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/8
                        via-transparent to-transparent pointer-events-none"/>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">
              <span className="w-6 h-px bg-violet-400"/>
              My Work
            </span>
            <h1 className="font-display text-title text-white uppercase">
              Portfolio
            </h1>
            <p className="text-slate-500 max-w-xl mt-3 text-sm leading-relaxed">
              A curated collection of projects — from brand films to YouTube series.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 py-8 bg-night-800 border-y border-white/[0.04]
                          sticky top-[65px] z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4
                        items-start sm:items-center justify-between">
          {/* Category pills */}
          <ProjectFilter
            categories={categories}
            active={category}
            onSelect={handleCategoryChange}
          />

          {/* Search + sort */}
          <div className="flex gap-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search..."
                className="glass text-sm text-slate-300 placeholder-slate-600
                           rounded-full px-4 py-2 pr-10 w-44
                           focus:outline-none focus:border-violet-500/50
                           transition-colors"
              />
              <button onClick={handleSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                                 text-slate-500 hover:text-violet-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth={1.5} className="w-4 h-4">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); setProjects([]); }}
              className="glass text-sm text-slate-400 rounded-full px-4 py-2
                         focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        {isLoading && page === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-night-800 animate-pulse"/>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-slate-600 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth={1} className="w-16 h-16 mx-auto">
                <rect x="2" y="7" width="20" height="15" rx="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </svg>
            </div>
            <p className="text-slate-500 text-lg">No projects found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, i) => (
              <motion.div key={project._id} variants={staggerItem}>
                <ProjectCard project={project} index={i}/>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load more */}
        {meta?.hasNextPage && (
          <div className="text-center mt-12">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
              className="btn-outline"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth={2} className="opacity-25"/>
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                          strokeWidth={2} strokeLinecap="round"/>
                  </svg>
                  Loading...
                </span>
              ) : 'Load more projects'}
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Portfolio;