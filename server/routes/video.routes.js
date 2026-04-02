const express = require('express');
const router  = express.Router();

const {
  getAllVideos,
  getFeaturedVideos,
  getVideoById,
  incrementVideoViews,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} = require('../controllers/video.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const {
  validateCreateVideo,
  validateUpdateVideo,
} = require('../validations/video.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/videos
router.get('/', getAllVideos);

// GET /api/videos/featured
router.get('/featured', getFeaturedVideos);

// GET /api/videos/:id
router.get('/:id', getVideoById);

// PATCH /api/videos/:id/view
router.patch('/:id/view', incrementVideoViews);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// POST /api/videos
router.post('/', protect, adminOnly, validateCreateVideo, createVideo);

// PUT /api/videos/:id
router.put('/:id', protect, adminOnly, validateUpdateVideo, updateVideo);

// DELETE /api/videos/:id
router.delete('/:id', protect, adminOnly, deleteVideo);

// PATCH /api/videos/reorder/batch
router.patch('/reorder/batch', protect, adminOnly, reorderVideos);

module.exports = router;