const express = require('express');
const router  = express.Router();

const {
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
} = require('../controllers/auth.controller');

const protect       = require('../middleware/protect');
const adminOnly     = require('../middleware/adminOnly');
const { authRateLimiter } = require('../middleware/rateLimiter');

const {
  validateLogin,
  validateChangePassword,
} = require('../validations/auth.validation');

// ─── Public ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', authRateLimiter, validateLogin, login);

// POST /api/auth/refresh  — reads httpOnly cookie, issues new access token
router.post('/refresh', refreshToken);

// ─── Protected ────────────────────────────────────────────────────────────────
// POST /api/auth/logout
router.post('/logout', protect, logout);

// GET /api/auth/me
router.get('/me', protect, getMe);

// PUT /api/auth/change-password
router.put('/change-password', protect, adminOnly, validateChangePassword, changePassword);

module.exports = router;