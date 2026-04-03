// Badge / pill label component

const colorMap = {
  violet:  'bg-violet-600/15 text-violet-400 border-violet-500/25',
  cyan:    'bg-cyan-600/15   text-cyan-400   border-cyan-500/25',
  gold:    'bg-gold-500/15   text-gold-400   border-gold-500/25',
  green:   'bg-green-500/10  text-green-400  border-green-500/20',
  red:     'bg-red-500/10    text-red-400    border-red-500/20',
  slate:   'bg-white/5       text-slate-400  border-white/10',
  custom:  '',
};

const sizeMap = {
  xs:  'text-[10px] px-2   py-0.5',
  sm:  'text-xs     px-2.5 py-1',
  md:  'text-sm     px-3   py-1.5',
};

const Badge = ({
  children,
  color        = 'violet',
  size         = 'sm',
  dot          = false,
  customColor,
  customBg,
  className    = '',
}) => {
  // Support inline custom color (for dynamic category colors)
  const inlineStyle = color === 'custom' && customColor
    ? {
        background: customBg  || `${customColor}18`,
        color:       customColor,
        border:      `1px solid ${customColor}35`,
      }
    : {};

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        tracking-wide uppercase
        ${colorMap[color] || colorMap.violet}
        ${sizeMap[size]   || sizeMap.sm}
        ${className}
      `}
      style={inlineStyle}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
};

export default Badge;