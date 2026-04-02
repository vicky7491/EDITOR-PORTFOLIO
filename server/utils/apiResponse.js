// Standardized API response helpers — keeps all responses consistent

/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable message
 * @param {any} data - Payload to send
 * @param {object} meta - Optional pagination / extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = { status: 'success', message };
  if (data !== null)  response.data = data;
  if (meta !== null)  response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response (used by global error handler)
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = { status: 'error', message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Build a pagination meta object
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { sendSuccess, sendError, paginationMeta };