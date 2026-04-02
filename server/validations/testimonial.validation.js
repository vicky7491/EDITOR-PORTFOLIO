const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());
  next();
};

const validateCreateTestimonial = [
  body('clientName')
    .trim()
    .notEmpty().withMessage('Client name is required'),

  body('review')
    .trim()
    .notEmpty().withMessage('Review text is required')
    .isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),

  handleValidationErrors,
];

const validateUpdateTestimonial = [
  body('clientName')
    .optional()
    .trim()
    .notEmpty().withMessage('Client name cannot be empty'),

  body('review')
    .optional()
    .isLength({ max: 1000 }).withMessage('Review cannot exceed 1000 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  handleValidationErrors,
];

module.exports = { validateCreateTestimonial, validateUpdateTestimonial };