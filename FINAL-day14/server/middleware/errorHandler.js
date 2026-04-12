/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Duplicate Error',
      message: `${field} already exists`
    });
  }

  // Custom application errors
  if (err.message && err.message.includes('GitHub user')) {
    return res.status(404).json({
      error: 'User Not Found',
      message: err.message
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.status ? 'Client Error' : 'Server Error',
    message: err.message || 'An unexpected error occurred'
  });
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
