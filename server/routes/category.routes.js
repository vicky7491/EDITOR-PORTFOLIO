const express = require('express');
const router  = express.Router();

const {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} = require('../controllers/category.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const {
  validateCreateCategory,
  validateUpdateCategory,
} = require('../validations/category.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/categories
router.get('/', getAllCategories);

// GET /api/categories/:slug
router.get('/:slug', getCategoryBySlug);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// POST /api/categories
router.post('/', protect, adminOnly, validateCreateCategory, createCategory);

// PUT /api/categories/:id
router.put('/:id', protect, adminOnly, validateUpdateCategory, updateCategory);

// DELETE /api/categories/:id  — also clears category ref from projects/videos
router.delete('/:id', protect, adminOnly, deleteCategory);

// PATCH /api/categories/reorder/batch
router.patch('/reorder/batch', protect, adminOnly, reorderCategories);

module.exports = router;