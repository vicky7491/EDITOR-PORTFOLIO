const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());
  next();
};

const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex code (e.g. #6366f1)'),

  body('description')
    .optional()
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),

  handleValidationErrors,
];

const validateUpdateCategory = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex code'),

  handleValidationErrors,
];

module.exports = { validateCreateCategory, validateUpdateCategory };