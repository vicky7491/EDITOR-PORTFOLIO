// Subtle film-grain / noise texture overlay for cinematic feel

const NoiseOverlay = ({
  opacity   = 0.035,
  blendMode = 'overlay',
  zIndex    = 1,
  fixed     = true,
}) => {
  return (
    <div
      aria-hidden
      style={{
        position:        fixed ? 'fixed' : 'absolute',
        inset:           0,
        zIndex,
        pointerEvents:   'none',
        mixBlendMode:    blendMode,
        opacity,
        // SVG fractal noise as inline data URI — no external file needed
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize:   '150px 150px',
      }}
    />
  );
};

export default NoiseOverlay;