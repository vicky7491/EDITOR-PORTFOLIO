// JWT access and refresh token generators

const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token (stored in memory on frontend)
 */
const generateAccessToken = (adminId, role) => {
  return jwt.sign(
    { id: adminId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate a long-lived refresh token (stored in httpOnly cookie)
 */
const generateRefreshToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Set the refresh token as an httpOnly cookie on the response
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,                                          // Not accessible via JS
    secure: process.env.NODE_ENV === 'production',           // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-origin in prod
    maxAge: sevenDays,
    path: '/api/auth',                                       // Only sent to auth routes
  });
};

/**
 * Clear the refresh token cookie (used on logout)
 */
const clearRefreshTokenCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
    path: '/api/auth',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};