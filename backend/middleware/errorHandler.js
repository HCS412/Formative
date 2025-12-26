// Centralized Error Handling Middleware

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static conflict(message, details = null) {
    return new ApiError(409, message, details);
  }

  static tooManyRequests(message = 'Too many requests') {
    return new ApiError(429, message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message);
  }
}

/**
 * Async handler wrapper - catches errors from async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not Found handler - catches 404s for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  // Skip for static files and SPA routes (handled by catch-all)
  if (req.path.startsWith('/api/')) {
    next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.path}`));
  } else {
    next();
  }
};

/**
 * Global error handler middleware
 * Must be registered last, after all routes
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code set
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  // Log the error
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode,
    message,
    userId: req.user?.userId || 'anonymous',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress,
  };

  // Log full stack trace for server errors
  if (statusCode >= 500) {
    console.error('Server Error:', errorLog);
    console.error(err.stack);
    
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
      message = 'Internal server error';
      details = null;
    }
  } else {
    // Log client errors at info level
    console.log('Client Error:', errorLog);
  }

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Invalid reference';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    message = 'Service temporarily unavailable';
  }

  // Send error response
  const response = {
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = {
  ApiError,
  asyncHandler,
  notFoundHandler,
  errorHandler
};
