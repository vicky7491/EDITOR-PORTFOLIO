// Utility helpers used across the public portfolio

// ── String utilities ──────────────────────────────────────────────────────────

/**
 * Truncate a string to maxLength, appending ellipsis
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length <= maxLength ? str : `${str.slice(0, maxLength).trim()}…`;
};

/**
 * Capitalize the first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert a string to a URL-safe slug
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// ── Date utilities ────────────────────────────────────────────────────────────

/**
 * Format a date to readable string
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
    ...options,
  }).format(new Date(date));
};

/**
 * Get year from a date string
 */
export const getYear = (date) => {
  if (!date) return '';
  return new Date(date).getFullYear();
};

/**
 * Time ago — "3 days ago", "2 months ago", etc.
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

// ── Number utilities ──────────────────────────────────────────────────────────

/**
 * Format a number with commas
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '';
  return num.toLocaleString('en-US');
};

/**
 * Format bytes to human-readable size
 */
export const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

/**
 * Linear interpolation
 */
export const lerp = (start, end, t) =>
  start + (end - start) * t;

// ── Array utilities ───────────────────────────────────────────────────────────

/**
 * Chunk an array into groups of size n
 */
export const chunk = (arr, size) => {
  if (!arr?.length) return [];
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle an array (Fisher-Yates)
 */
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Remove duplicates from array by a key
 */
export const uniqueBy = (arr, key) => {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

// ── URL / media utilities ─────────────────────────────────────────────────────

/**
 * Detect video source type from URL
 */
export const detectVideoType = (url) => {
  if (!url) return 'unknown';
  if (/youtube\.com|youtu\.be/.test(url))  return 'youtube';
  if (/vimeo\.com/.test(url))              return 'vimeo';
  if (/cloudinary\.com/.test(url))         return 'cloudinary';
  if (/\.(mp4|webm|ogg|mov)$/i.test(url)) return 'native';
  return 'native';
};

/**
 * Extract YouTube video ID from URL
 */
export const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m?.[1] || null;
};

/**
 * Extract Vimeo video ID from URL
 */
export const getVimeoId = (url) => {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m?.[1] || null;
};

/**
 * Build a Cloudinary optimized URL
 */
export const cloudinaryUrl = (publicId, { width, height, quality = 'auto', format = 'auto' } = {}) => {
  if (!publicId) return '';
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return '';

  const transforms = [
    width    ? `w_${width}`    : '',
    height   ? `h_${height}`   : '',
    `q_${quality}`,
    `f_${format}`,
    'c_fill',
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
};

// ── DOM utilities ─────────────────────────────────────────────────────────────

/**
 * Smooth scroll to element by selector
 */
export const scrollTo = (selector, offset = 80) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    const success = document.execCommand('copy');
    document.body.removeChild(el);
    return success;
  }
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Generate a random ID string
 */
export const uid = (length = 8) =>
  Math.random().toString(36).substring(2, 2 + length);