const Admin = require('../models/Admin.model');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find admin — explicitly select password (it's select:false in schema)
    const admin = await Admin.findOne({ email }).select('+password +refreshTokens');
    if (!admin) {
      return next(new AppError('Invalid email or password', 401));
    }

    // 2. Compare submitted password with hashed one in DB
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // 3. Generate both tokens
    const accessToken  = generateAccessToken(admin._id, admin.role);
    const refreshToken = generateRefreshToken(admin._id);

    // 4. Store refresh token in DB (allows revocation per device)
    //    Keep max 5 refresh tokens (5 devices). Drop oldest if exceeded.
    const tokens = admin.refreshTokens || [];
    tokens.push(refreshToken);
    if (tokens.length > 5) tokens.shift();
    admin.refreshTokens = tokens;
    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });

    // 5. Set refresh token as httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // 6. Send access token + admin info in body
    return sendSuccess(res, 200, 'Login successful', {
      accessToken,
      admin: {
        id:    admin._id,
        email: admin.email,
        role:  admin.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Refresh access token using httpOnly refresh cookie
// @route   POST /api/auth/refresh
// @access  Public (reads cookie)
// ─────────────────────────────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    // 1. Read cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new AppError('No refresh token. Please log in.', 401));
    }

    // 2. Verify signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      clearRefreshTokenCookie(res);
      return next(new AppError('Invalid or expired session. Please log in again.', 401));
    }

    // 3. Find admin and check the token exists in their stored list
    const admin = await Admin.findById(decoded.id).select('+refreshTokens');
    if (!admin || !admin.refreshTokens.includes(token)) {
      clearRefreshTokenCookie(res);
      return next(new AppError('Session not recognized. Please log in again.', 401));
    }

    // 4. Rotate: remove old refresh token, issue new one
    admin.refreshTokens = admin.refreshTokens.filter((t) => t !== token);
    const newRefreshToken = generateRefreshToken(admin._id);
    admin.refreshTokens.push(newRefreshToken);
    await admin.save({ validateBeforeSave: false });

    // 5. New access token
    const newAccessToken = generateAccessToken(admin._id, admin.role);

    setRefreshTokenCookie(res, newRefreshToken);

    return sendSuccess(res, 200, 'Token refreshed', {
      accessToken: newAccessToken,
      admin: {
        id:    admin._id,
        email: admin.email,
        role:  admin.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Logout — clear cookie and remove refresh token from DB
// @route   POST /api/auth/logout
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      // Remove this specific refresh token from DB
      await Admin.findByIdAndUpdate(req.admin._id, {
        $pull: { refreshTokens: token },
      });
    }

    clearRefreshTokenCookie(res);

    return sendSuccess(res, 200, 'Logged out successfully');

  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current logged-in admin info
// @route   GET /api/auth/me
// @access  Protected
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.admin is attached by protect middleware (no password, no tokens)
    return sendSuccess(res, 200, 'Admin info retrieved', {
      admin: {
        id:        req.admin._id,
        email:     req.admin.email,
        role:      req.admin.role,
        lastLogin: req.admin.lastLogin,
        createdAt: req.admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Protected + Admin
// ─────────────────────────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch admin with password
    const admin = await Admin.findById(req.admin._id).select('+password +refreshTokens');

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password — pre-save hook will hash it
    admin.password = newPassword;

    // Invalidate all existing refresh tokens (force re-login everywhere)
    admin.refreshTokens = [];
    await admin.save();

    clearRefreshTokenCookie(res);

    return sendSuccess(res, 200, 'Password changed successfully. Please log in again.');

  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, refreshToken, getMe, changePassword };