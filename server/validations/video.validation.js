const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());
  next();
};

const validateCreateVideo = [
  body('title')
    .trim()
    .notEmpty().withMessage('Video title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('videoUrl')
    .notEmpty().withMessage('Video URL is required')
    .isURL().withMessage('Must be a valid URL'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),

  handleValidationErrors,
];

const validateUpdateVideo = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('videoUrl')
    .optional()
    .isURL().withMessage('Must be a valid URL'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  handleValidationErrors,
];

module.exports = { validateCreateVideo, validateUpdateVideo };