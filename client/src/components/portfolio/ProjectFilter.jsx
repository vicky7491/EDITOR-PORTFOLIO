import { motion } from 'framer-motion';

const ProjectFilter = ({ categories, active, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* All button */}
      <button
        onClick={() => onSelect('')}
        className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide
          transition-all duration-200
          ${!active
            ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
            : 'glass text-slate-400 hover:text-white hover:border-violet-500/30'}`}
      >
        All Work
      </button>

      {categories.map((cat) => (
        <motion.button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide
            transition-all duration-200
            ${active === cat._id
              ? 'text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]'
              : 'glass text-slate-400 hover:text-white'}`}
          style={active === cat._id ? {
            background: cat.color + '25',
            color:      cat.color,
            border:     `1px solid ${cat.color}50`,
          } : {}}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
};

export default ProjectFilter;