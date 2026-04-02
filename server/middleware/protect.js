// JWT verification middleware — attaches req.admin if valid

const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin.model');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Check the admin still exists in DB (handles deleted accounts)
    const admin = await Admin.findById(decoded.id).select('-password -refreshTokens');
    if (!admin) {
      return next(new AppError('Account no longer exists.', 401));
    }

    // 4. Attach admin to request for downstream use
    req.admin = admin;
    next();

  } catch (error) {
    next(error); // Will be caught by errorHandler (handles TokenExpiredError etc.)
  }
};

module.exports = protect;