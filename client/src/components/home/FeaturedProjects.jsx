import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFeaturedProjects } from '@/api/publicApi';
import useInView from '@/hooks/useInView';
import { staggerContainer, staggerItem } from '@/utils/motion';
import ProjectCard from '@/components/portfolio/ProjectCard';

const FeaturedProjects = () => {
  const [projects,  setProjects]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, inView] = useInView();

  useEffect(() => {
    getFeaturedProjects(6)
      .then((res) => setProjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && projects.length === 0) return null;

  return (
    <section ref={ref} className="section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between
                   gap-4 mb-12"
      >
        <div>
          <span className="section-tag">
            <span className="w-6 h-px bg-violet-400"/>
            Selected Work
          </span>
          <h2 className="font-display text-title text-white uppercase">
            Featured Projects
          </h2>
        </div>
        <Link to="/portfolio" className="btn-outline text-sm whitespace-nowrap self-start sm:self-auto">
          View all work →
        </Link>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}
                 className="aspect-[4/3] rounded-2xl bg-night-800 animate-pulse"/>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, i) => (
            <motion.div key={project._id} variants={staggerItem}>
              <ProjectCard project={project} index={i}/>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedProjects;