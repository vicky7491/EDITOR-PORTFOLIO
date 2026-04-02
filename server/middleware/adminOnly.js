// Role-based access control — only 'admin' role allowed on sensitive routes

const AppError = require('../utils/AppError');
const { ROLES } = require('../config/constants');

const adminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== ROLES.ADMIN) {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }
  next();
};

module.exports = adminOnly;