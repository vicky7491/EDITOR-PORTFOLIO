// Centralized global error handler — all errors bubble up here

const { sendError } = require('../utils/apiResponse');

// ── Mongoose-specific error converters ──────────────────────────────────────

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, message };
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  const message = `Validation failed: ${messages.join('. ')}`;
  return { statusCode: 400, message };
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value: "${value}" already exists for field "${field}".`;
  return { statusCode: 409, message };
};

// ── JWT error converters ─────────────────────────────────────────────────────

const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.',
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your session has expired. Please log in again.',
});

// ── Main error handler middleware ────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // Convert known error types to user-friendly messages
  if (err.name === 'CastError')              ({ statusCode, message } = handleCastError(err));
  if (err.name === 'ValidationError')        ({ statusCode, message } = handleValidationError(err));
  if (err.code === 11000)                    ({ statusCode, message } = handleDuplicateKeyError(err));
  if (err.name === 'JsonWebTokenError')      ({ statusCode, message } = handleJWTError());
  if (err.name === 'TokenExpiredError')      ({ statusCode, message } = handleJWTExpiredError());

  // In development, also log the stack trace for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('\n🔴 ERROR:', err.stack, '\n');
  }

  // In production, never expose internal error messages for 500 errors
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong. Please try again later.';
  }

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;