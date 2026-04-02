const express = require('express');
const router  = express.Router();

const {
  getDashboardStats,
  getRecentActivity,
  getChartData,
} = require('../controllers/dashboard.controller');

const protect   = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

// All dashboard routes are admin-only
router.use(protect, adminOnly);

// ─── GET /api/admin/dashboard/stats ───────────────────────────────────────────
// Returns: counts for all entities + unread inquiry count
router.get('/stats', getDashboardStats);

// ─── GET /api/admin/dashboard/activity ────────────────────────────────────────
// Returns: last 10 projects + last 10 inquiries (for recent activity feed)
router.get('/activity', getRecentActivity);

// ─── GET /api/admin/dashboard/charts ──────────────────────────────────────────
// Returns: monthly inquiry data + project-by-category breakdown for charts
router.get('/charts', getChartData);

module.exports = router;