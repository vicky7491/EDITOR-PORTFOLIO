const { body } = require('express-validator');
const { sendError } = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, 'Validation failed', errors.array());
  }
  next();
};

const validateCreateProject = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('shortDescription')
    .optional()
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),

  body('softwareUsed')
    .optional()
    .isArray().withMessage('Software used must be an array'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),

  handleValidationErrors,
];

const validateUpdateProject = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('shortDescription')
    .optional()
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),

  handleValidationErrors,
];

module.exports = { validateCreateProject, validateUpdateProject };