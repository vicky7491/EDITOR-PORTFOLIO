const express = require('express');
const router  = express.Router();

const {
  uploadImageHandler,
  uploadVideoHandler,
  deleteMediaHandler,
} = require('../controllers/upload.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');
const { uploadImage, uploadVideo } = require('../middleware/upload');

// All upload routes are admin-protected — applied to every route below
router.use(protect, adminOnly);

// ─── POST /api/admin/upload/image ─────────────────────────────────────────────
// Field name: 'image'  — optional query: ?folder=thumbnails|avatars|services|site
router.post('/image', uploadImage.single('image'), uploadImageHandler);

// ─── POST /api/admin/upload/video ─────────────────────────────────────────────
// Field name: 'video'
router.post('/video', uploadVideo.single('video'), uploadVideoHandler);

// ─── DELETE /api/admin/upload/:publicId ───────────────────────────────────────
// Body: { resourceType: 'image' | 'video' }
// publicId is base64-encoded in the URL param to handle slashes in Cloudinary IDs
router.delete('/:publicId', deleteMediaHandler);

module.exports = router;