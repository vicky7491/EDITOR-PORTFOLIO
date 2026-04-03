// Intersection-observer lazy image with blur-up placeholder

import { useState, useRef, useEffect } from 'react';

const LazyImage = ({
  src,
  alt         = '',
  className   = '',
  placeholder = null,   // low-quality placeholder URL (optional)
  objectFit   = 'cover',
  width,
  height,
  onLoad,
  ...props
}) => {
  const imgRef   = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [inView, setInView]   = useState(false);
  const [error,  setError]    = useState(false);

  // Intersection observer — only load image when near viewport
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-night-800 ${className}`}
      style={{ width, height }}
      {...props}
    >
      {/* Blur placeholder */}
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover
                     filter blur-lg scale-110 transition-opacity duration-300"
          style={{ opacity: loaded ? 0 : 1 }}
        />
      )}

      {/* Shimmer skeleton */}
      {!loaded && !placeholder && (
        <div className="absolute inset-0 bg-gradient-to-r
                        from-night-800 via-night-700 to-night-800
                        animate-pulse"/>
      )}

      {/* Actual image */}
      {inView && !error && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={() => setError(true)}
          className={`w-full h-full transition-opacity duration-500
                      ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center
                        text-night-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1} className="w-8 h-8">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default LazyImage;