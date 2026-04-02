const express = require('express');
const router  = express.Router();

const {
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleFeatured,
  reorderTestimonials,
} = require('../controllers/testimonial.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const {
  validateCreateTestimonial,
  validateUpdateTestimonial,
} = require('../validations/testimonial.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/testimonials
router.get('/', getAllTestimonials);

// GET /api/testimonials/featured
router.get('/featured', getFeaturedTestimonials);

// GET /api/testimonials/:id
router.get('/:id', getTestimonialById);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// POST /api/testimonials
router.post('/', protect, adminOnly, validateCreateTestimonial, createTestimonial);

// PUT /api/testimonials/:id
router.put('/:id', protect, adminOnly, validateUpdateTestimonial, updateTestimonial);

// PATCH /api/testimonials/:id/featured  → toggle featured flag
router.patch('/:id/featured', protect, adminOnly, toggleFeatured);

// PATCH /api/testimonials/reorder/batch
router.patch('/reorder/batch', protect, adminOnly, reorderTestimonials);

// DELETE /api/testimonials/:id
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;