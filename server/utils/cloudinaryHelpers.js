// Cloudinary helpers — delete, optimize, transform

const cloudinary = require('../config/cloudinary');

// ── Delete a resource ─────────────────────────────────────────────────────────
const deleteFromCloudinary = async (publicId, type = 'image') => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
      invalidate:    true,
    });
  } catch (err) {
    console.error(`❌ Cloudinary delete failed [${publicId}]:`, err.message);
    return null;
  }
};

// ── Generate optimized image URL ──────────────────────────────────────────────
const getOptimizedUrl = (publicId, options = {}) => {
  if (!publicId) return null;
  const {
    width   = 800,
    height,
    crop    = 'fill',
    format  = 'auto',
    quality = 'auto',
    gravity = 'auto',
  } = options;

  const transform = { quality, fetch_format: format, crop, gravity };
  if (width)  transform.width  = width;
  if (height) transform.height = height;

  return cloudinary.url(publicId, {
    transformation: [transform],
    secure:         true,
  });
};

// ── Generate responsive srcset ────────────────────────────────────────────────
const getResponsiveSrcSet = (publicId, widths = [400, 800, 1200, 1600]) => {
  if (!publicId) return '';
  return widths
    .map((w) => {
      const url = cloudinary.url(publicId, {
        transformation: [{ width: w, crop: 'scale', quality: 'auto', fetch_format: 'auto' }],
        secure:         true,
      });
      return `${url} ${w}w`;
    })
    .join(', ');
};

// ── Generate video thumbnail at a specific second ────────────────────────────
const getVideoThumbnail = (videoPublicId, { second = 0, width = 640, height = 360 } = {}) => {
  if (!videoPublicId) return null;
  return cloudinary.url(videoPublicId, {
    resource_type:  'video',
    format:         'jpg',
    transformation: [
      { width, height, crop: 'fill', quality: 'auto' },
      { start_offset: second },
    ],
    secure: true,
  });
};

// ── Get video stream URL with adaptive bitrate ────────────────────────────────
const getStreamingUrl = (videoPublicId) => {
  if (!videoPublicId) return null;
  return cloudinary.url(videoPublicId, {
    resource_type:  'video',
    streaming_profile: 'hd',
    format:            'm3u8',
    secure:            true,
  });
};

// ── Build a blur placeholder data URL (tiny version of image) ────────────────
const getBlurDataUrl = (publicId) => {
  if (!publicId) return null;
  return cloudinary.url(publicId, {
    transformation: [
      { width: 10, height: 10, crop: 'scale', quality: 1, fetch_format: 'auto' },
      { effect: 'blur:2000' },
    ],
    secure: true,
  });
};

// ── Format bytes ──────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

module.exports = {
  deleteFromCloudinary,
  getOptimizedUrl,
  getResponsiveSrcSet,
  getVideoThumbnail,
  getStreamingUrl,
  getBlurDataUrl,
  formatBytes,
};