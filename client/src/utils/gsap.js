// Central GSAP registration — import this ONCE in main.jsx
// so plugins are registered before any component uses them

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

// Register all plugins at module level
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

// ── Default ScrollTrigger settings ───────────────────────────────────────────
ScrollTrigger.defaults({
  markers:    false,
  toggleActions: 'play none none reverse',
});

// ── Smooth scroll setup ───────────────────────────────────────────────────────
// Snap GSAP's ticker to requestAnimationFrame for consistent 60fps
gsap.ticker.lagSmoothing(0);

export { gsap, ScrollTrigger };