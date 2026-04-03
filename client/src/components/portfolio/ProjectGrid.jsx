// Reusable project grid — accepts projects array + handles empty/loading states
// Used by Portfolio.jsx and FeaturedProjects.jsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/utils/motion';
import ProjectCard  from './ProjectCard';
import ProjectModal from './ProjectModal';
import { ProjectCardSkeleton } from '@/components/ui/SkeletonLoader';

const ProjectGrid = ({
  projects,
  isLoading,
  columns   = 3,
  showModal = false,   // if true, clicking card opens modal instead of navigating
  emptyMessage = 'No projects found.',
  emptySubtext = 'Check back soon for new work.',
}) => {
  const [modalProject, setModalProject] = useState(null);

  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={`grid ${colMap[columns] || colMap[3]} gap-6`}>
        {[...Array(columns * 2)].map((_, i) => (
          <ProjectCardSkeleton key={i}/>
        ))}
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-24">
        <div className="text-night-700 mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={0.8} className="w-16 h-16 mx-auto">
            <rect x="2" y="7" width="20" height="15" rx="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
        </div>
        <p className="text-slate-500 text-lg">{emptyMessage}</p>
        <p className="text-slate-600 text-sm mt-1">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={`grid ${colMap[columns] || colMap[3]} gap-6`}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            variants={staggerItem}
          >
            <ProjectCard
              project={project}
              index={i}
              onClick={showModal ? () => setModalProject(project) : undefined}
            />
          </motion.div>
        ))}
      </motion.div>

      {showModal && (
        <ProjectModal
          project={modalProject}
          isOpen={!!modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </>
  );
};

export default ProjectGrid;