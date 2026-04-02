const express = require('express');
const router  = express.Router();

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
  toggleServiceActive,
} = require('../controllers/service.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

const {
  validateCreateService,
  validateUpdateService,
} = require('../validations/service.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/services    → only active services, sorted by order
router.get('/', getAllServices);

// GET /api/services/:id
router.get('/:id', getServiceById);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// POST /api/services
router.post('/', protect, adminOnly, validateCreateService, createService);

// PUT /api/services/:id
router.put('/:id', protect, adminOnly, validateUpdateService, updateService);

// PATCH /api/services/:id/toggle  → flip active flag
router.patch('/:id/toggle', protect, adminOnly, toggleServiceActive);

// PATCH /api/services/reorder/batch
router.patch('/reorder/batch', protect, adminOnly, reorderServices);

// DELETE /api/services/:id
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;