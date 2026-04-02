const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());
  next();
};

const validateCreateService = [
  body('title')
    .trim()
    .notEmpty().withMessage('Service title is required')
    .isLength({ max: 80 }).withMessage('Title cannot exceed 80 characters'),

  body('shortDescription')
    .trim()
    .notEmpty().withMessage('Short description is required')
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('description')
    .notEmpty().withMessage('Full description is required'),

  body('deliverables')
    .optional()
    .isArray().withMessage('Deliverables must be an array'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active must be a boolean'),

  handleValidationErrors,
];

const validateUpdateService = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 80 }).withMessage('Title cannot exceed 80 characters'),

  body('shortDescription')
    .optional()
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('deliverables')
    .optional()
    .isArray().withMessage('Deliverables must be an array'),

  handleValidationErrors,
];

module.exports = { validateCreateService, validateUpdateService };