// server/middleware/upload.js
// REPLACES the previous version — fixes folder routing from query param

const multer  = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const AppError   = require('../utils/AppError');
const {
  UPLOAD_FOLDERS,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
} = require('../config/constants');

// ── Resolve folder from request ───────────────────────────────────────────────
// Admin can pass ?folder=avatars|thumbnails|services|site|before-after
// Defaults to thumbnails for images, videos folder for video

const resolveFolder = (req, defaultFolder) => {
  const allowed = Object.values(UPLOAD_FOLDERS);
  const requested = req.query.folder
    ? `vickyvfx/${req.query.folder}`
    : defaultFolder;
  return allowed.includes(requested) ? requested : defaultFolder;
};

// ── Safe public ID: strip extension, replace spaces ──────────────────────────
const makePublicId = (originalname) => {
  const base = originalname
    .replace(/\.[^.]+$/, '')     // strip extension
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/[^a-zA-Z0-9_-]/g, '') // strip special chars
    .substring(0, 60);           // max 60 chars
  return `${Date.now()}-${base}`;
};

// ── Cloudinary image storage ──────────────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          resolveFolder(req, UPLOAD_FOLDERS.THUMBNAILS),
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    public_id:       makePublicId(file.originalname),
  }),
});

// ── Cloudinary video storage ──────────────────────────────────────────────────
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          UPLOAD_FOLDERS.VIDEOS,
    resource_type:   'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    public_id:       makePublicId(file.originalname),
    // Auto-generate a thumbnail poster at 2s mark
    eager: [
      { width: 800, height: 450, crop: 'fill', format: 'jpg' },
    ],
    eager_async: true,
  }),
});

// ── File filters ──────────────────────────────────────────────────────────────
const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid image type "${file.mimetype}". Allowed: JPEG, PNG, WebP, GIF`,
        400
      ),
      false
    );
  }
};

const videoFileFilter = (req, file, cb) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid video type "${file.mimetype}". Allowed: MP4, MOV, AVI, MKV, WebM`,
        400
      ),
      false
    );
  }
};

// ── Multer instances ──────────────────────────────────────────────────────────
const uploadImage = multer({
  storage:    imageStorage,
  fileFilter: imageFileFilter,
  limits:     { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
});

const uploadVideo = multer({
  storage:    videoStorage,
  fileFilter: videoFileFilter,
  limits:     { fileSize: MAX_VIDEO_SIZE_MB * 1024 * 1024 },
});

// ── Multer error handler — converts MulterError to AppError ──────────────────
const handleMulterError = (err, req, res, next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return next(
      new AppError(
        `File too large. Maximum size: ${
          err.field === 'video' ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB
        }MB`,
        413
      )
    );
  }
  next(err);
};

module.exports = { uploadImage, uploadVideo, handleMulterError };