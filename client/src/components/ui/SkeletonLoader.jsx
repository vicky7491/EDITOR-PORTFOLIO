// Configurable skeleton loading placeholder

const SkeletonLoader = ({
  variant  = 'rect',   // 'rect' | 'circle' | 'text' | 'card'
  width    = '100%',
  height   = '16px',
  count    = 1,
  className = '',
  rounded  = false,
}) => {
  const baseClass = `bg-gradient-to-r from-night-800 via-night-700 to-night-800
                     animate-pulse`;

  const variants = {
    rect:   `rounded-lg`,
    circle: `rounded-full`,
    text:   `rounded`,
    card:   `rounded-2xl`,
  };

  const rounding = rounded ? 'rounded-full' : (variants[variant] || 'rounded-lg');

  if (count === 1) {
    return (
      <div
        className={`${baseClass} ${rounding} ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${rounding}`}
          style={{
            width:  i === count - 1 ? '75%' : width,
            height,
          }}
        />
      ))}
    </div>
  );
};

// ── Pre-composed skeletons ────────────────────────────────────────────────────

export const ProjectCardSkeleton = () => (
  <div className="glass rounded-2xl overflow-hidden">
    <SkeletonLoader variant="rect" height="220px" rounded={false}/>
    <div className="p-5 space-y-3">
      <SkeletonLoader variant="text" width="40%" height="12px"/>
      <SkeletonLoader variant="text" height="20px"/>
      <SkeletonLoader variant="text" count={2} height="12px"/>
    </div>
  </div>
);

export const ServiceCardSkeleton = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <SkeletonLoader variant="rect" width="48px" height="48px" rounded/>
    <SkeletonLoader variant="text" width="60%" height="20px"/>
    <SkeletonLoader variant="text" count={3} height="12px"/>
  </div>
);

export const TestimonialCardSkeleton = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <SkeletonLoader variant="text" width="30%" height="12px"/>
    <SkeletonLoader variant="text" count={4} height="12px"/>
    <div className="flex items-center gap-3 pt-4">
      <SkeletonLoader variant="circle" width="40px" height="40px"/>
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="text" width="50%" height="14px"/>
        <SkeletonLoader variant="text" width="35%" height="11px"/>
      </div>
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="min-h-screen bg-night-900 flex items-center px-6">
    <div className="max-w-4xl space-y-6">
      <SkeletonLoader variant="text" width="120px" height="12px"/>
      <SkeletonLoader variant="text" height="clamp(3rem,8vw,6rem)"/>
      <SkeletonLoader variant="text" width="70%" height="clamp(3rem,8vw,6rem)"/>
      <SkeletonLoader variant="text" width="80%" count={2} height="18px"/>
      <div className="flex gap-4 pt-4">
        <SkeletonLoader variant="rect" width="140px" height="48px" rounded/>
        <SkeletonLoader variant="rect" width="120px" height="48px" rounded/>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;