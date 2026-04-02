const express = require('express');
const router  = express.Router();

const {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
  updateHeroSection,
  updateSocialLinks,
  updateContactInfo,
  updateSeoSettings,
  updateStats,
} = require('../controllers/settings.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/settings    → returns only public-safe fields (no internal flags)
router.get('/', getPublicSettings);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// GET /api/settings/admin     → full settings document
router.get('/admin', protect, adminOnly, getAdminSettings);

// PUT /api/settings            → update entire settings document
router.put('/', protect, adminOnly, updateSettings);

// PATCH /api/settings/hero     → update hero section only
router.patch('/hero', protect, adminOnly, updateHeroSection);

// PATCH /api/settings/social   → update social links only
router.patch('/social', protect, adminOnly, updateSocialLinks);

// PATCH /api/settings/contact  → update contact info only
router.patch('/contact', protect, adminOnly, updateContactInfo);

// PATCH /api/settings/seo      → update SEO metadata only
router.patch('/seo', protect, adminOnly, updateSeoSettings);

// PATCH /api/settings/stats    → update homepage stats array
router.patch('/stats', protect, adminOnly, updateStats);

module.exports = router;