// Rate limiting middleware — prevent brute force and abuse

const rateLimit = require('express-rate-limit');

// ── Global limiter: all /api/* routes ────────────────────────────────────────

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
  skip: (req) => req.method === 'OPTIONS', // Don't rate-limit preflight
});

// ── Auth limiter: stricter limit on login attempts ────────────────────────────

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                    // Only 10 login attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// ── Contact form limiter: prevent spam ────────────────────────────────────────

const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // Max 5 contact form submissions per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many messages sent. Please try again in an hour.',
  },
});

module.exports = { globalRateLimiter, authRateLimiter, contactRateLimiter };