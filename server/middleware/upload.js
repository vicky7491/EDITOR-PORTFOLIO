// Multer + Cloudinary storage for image and video uploads

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

// ── Cloudinary Image Storage ──────────────────────────────────────────────────

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: req.uploadFolder || UPLOAD_FOLDERS.THUMBNAILS,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '-')}`,
  }),
});

// ── Cloudinary Video Storage ──────────────────────────────────────────────────

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: UPLOAD_FOLDERS.VIDEOS,
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '-')}`,
  }),
});

// ── File Filter Factories ─────────────────────────────────────────────────────

const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`, 400), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`Invalid file type. Allowed: ${ALLOWED_VIDEO_TYPES.join(', ')}`, 400), false);
  }
};

// ── Multer Upload Instances ───────────────────────────────────────────────────

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE_MB * 1024 * 1024 },
});

module.exports = { uploadImage, uploadVideo };