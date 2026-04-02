const express = require('express');
const router  = express.Router();

const {
  submitContactForm,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
  addAdminNote,
  deleteInquiry,
  getInquiryStats,
} = require('../controllers/contact.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');
const { contactRateLimiter } = require('../middleware/rateLimiter');

const {
  validateContactForm,
  validateStatusUpdate,
} = require('../validations/contact.validation');

// ─── Public routes ────────────────────────────────────────────────────────────

// POST /api/contact    → submit contact form (rate limited: 5/hour)
router.post('/', contactRateLimiter, validateContactForm, submitContactForm);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// GET /api/contact/inquiries            → all inquiries with filters
router.get('/inquiries', protect, adminOnly, getAllInquiries);

// GET /api/contact/inquiries/stats      → unread count, total, by-status breakdown
router.get('/inquiries/stats', protect, adminOnly, getInquiryStats);

// GET /api/contact/inquiries/:id        → single inquiry detail
router.get('/inquiries/:id', protect, adminOnly, getInquiryById);

// PATCH /api/contact/inquiries/:id/status  → mark read / unread / replied
router.patch('/inquiries/:id/status', protect, adminOnly, validateStatusUpdate, updateInquiryStatus);

// PATCH /api/contact/inquiries/:id/note   → add admin note
router.patch('/inquiries/:id/note', protect, adminOnly, addAdminNote);

// DELETE /api/contact/inquiries/:id
router.delete('/inquiries/:id', protect, adminOnly, deleteInquiry);

module.exports = router;