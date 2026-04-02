import { motion } from 'framer-motion';

const StatsCard = ({ label, value, sub, icon, color = 'brand', trend }) => {
  const colorMap = {
    brand:  { bg: 'bg-brand-600/10',  icon: 'text-brand-400',  border: 'border-brand-600/20'  },
    green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/20'  },
    amber:  { bg: 'bg-amber-500/10',  icon: 'text-amber-400',  border: 'border-amber-500/20'  },
    blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20'   },
    red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20'    },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 border ${c.border} hover:border-opacity-40
                  transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${c.bg}`}>
          <span className={`${c.icon} block`}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
            ${trend >= 0
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100 mb-0.5">{value}</p>
        <p className="text-sm font-medium text-slate-300">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
};

export default StatsCard;