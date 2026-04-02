const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendError(res, 400, 'Validation failed', errors.array());
  next();
};

const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Must be a valid phone number'),

  body('subject')
    .optional()
    .isLength({ max: 150 }).withMessage('Subject cannot exceed 150 characters'),

  body('budget')
    .optional()
    .isLength({ max: 50 }).withMessage('Budget field cannot exceed 50 characters'),

  body('service')
    .optional()
    .isLength({ max: 80 }).withMessage('Service field cannot exceed 80 characters'),

  handleValidationErrors,
];

const validateStatusUpdate = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['unread', 'read', 'replied']).withMessage('Status must be unread, read, or replied'),

  handleValidationErrors,
];

module.exports = { validateContactForm, validateStatusUpdate };
