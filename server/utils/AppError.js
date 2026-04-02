// Custom error class — lets us attach HTTP status codes to thrown errors

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flag: we created this intentionally

    // Preserve original stack trace (excludes this constructor frame)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;