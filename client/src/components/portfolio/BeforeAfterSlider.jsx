// Interactive before/after image comparison slider
// Supports both mouse and touch

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const BeforeAfterSlider = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Before',
  afterLabel  = 'After',
  className   = '',
  initialPosition = 50,  // percent
}) => {
  const [position, setPosition]   = useState(initialPosition);
  const [dragging, setDragging]   = useState(false);
  const containerRef = useRef(null);

  // ── Calculate position from pointer event ──────────────────────────────────
  const calcPosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(2, Math.min(98, pct)));
  }, []);

  // ── Mouse events ───────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    setDragging(true);
    calcPosition(e.clientX);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => calcPosition(e.clientX);
    const onUp   = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [dragging, calcPosition]);

  // ── Touch events ───────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    setDragging(true);
    calcPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => calcPosition(e.touches[0].clientX);
    const onEnd  = () => setDragging(false);

    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend',  onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onEnd);
    };
  }, [dragging, calcPosition]);

  if (!beforeUrl || !afterUrl) return null;

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className={`relative overflow-hidden rounded-2xl select-none
                  aspect-video bg-night-900 ${className}`}
      style={{ cursor: dragging ? 'grabbing' : 'col-resize' }}
    >
      {/* ── After image (base layer, full width) ──────────────────────────── */}
      <img
        src={afterUrl}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Before image (clipped to left of handle) ──────────────────────── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeUrl}
          alt={beforeLabel}
          draggable={false}
          className="absolute inset-0 h-full object-cover"
          style={{
            width:    `${(100 / position) * 100}%`,
            maxWidth: 'none',
          }}
        />
      </div>

      {/* ── Divider line ──────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80"
        style={{ left: `${position}%` }}
      >
        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                     w-10 h-10 rounded-full bg-white shadow-2xl
                     flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          animate={{ scale: dragging ? 1.15 : 1 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a12"
               strokeWidth={2} className="w-5 h-5">
            <polyline points="9 18 3 12 9 6"   strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="15 6 21 12 15 18" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* ── Labels ────────────────────────────────────────────────────────── */}
      <div className="absolute top-3 left-3">
        <span className="text-xs font-medium bg-black/60 backdrop-blur-sm
                         text-white px-2.5 py-1 rounded-full">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="text-xs font-medium bg-black/60 backdrop-blur-sm
                         text-white px-2.5 py-1 rounded-full">
          {afterLabel}
        </span>
      </div>

      {/* ── Hint (disappears after first interaction) ─────────────────────── */}
      {!dragging && position === initialPosition && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: 3, duration: 1.2 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2
                     text-[10px] bg-black/50 text-white/70 px-3 py-1
                     rounded-full whitespace-nowrap"
        >
          ← Drag to compare →
        </motion.div>
      )}
    </div>
  );
};

export default BeforeAfterSlider;