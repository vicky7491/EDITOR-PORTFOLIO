import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Reusable button component
 *
 * variant: 'primary' | 'outline' | 'ghost' | 'danger'
 * size:    'sm' | 'md' | 'lg'
 * as:      'button' | 'a' | 'link' (React Router Link)
 */
const variants = {
  primary: `bg-violet-600 hover:bg-violet-500 text-white
             hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]`,
  outline: `border border-white/20 hover:border-violet-400/60
             text-slate-300 hover:text-white hover:bg-violet-600/10`,
  ghost:   `text-slate-400 hover:text-white hover:bg-white/5`,
  danger:  `bg-red-600/20 hover:bg-red-600/30 text-red-400
             border border-red-500/20 hover:border-red-500/40`,
};

const sizes = {
  sm: 'text-xs px-4  py-2   gap-1.5',
  md: 'text-sm px-7  py-3.5 gap-2',
  lg: 'text-base px-8 py-4  gap-2.5',
};

const Button = forwardRef(({
  children,
  variant   = 'primary',
  size      = 'md',
  as        = 'button',
  to,
  href,
  disabled  = false,
  loading   = false,
  fullWidth = false,
  className = '',
  onClick,
  type      = 'button',
  ...props
}, ref) => {
  const base = `
    inline-flex items-center justify-center rounded-full font-body font-medium
    tracking-wide transition-all duration-300 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor"
                  strokeWidth={2} className="opacity-25"/>
          <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor"
                strokeWidth={2} strokeLinecap="round"/>
        </svg>
      )}
      {children}
    </>
  );

  // React Router Link
  if (as === 'link' && to) {
    return (
      <Link ref={ref} to={to} className={base} {...props}>
        {content}
      </Link>
    );
  }

  // Anchor tag
  if (as === 'a' || href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={base}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  // Default button
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={base}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      {...props}
    >
      {content}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;