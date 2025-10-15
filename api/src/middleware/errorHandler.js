const { AppError } = require('../utils/errors');
const config = require('../config');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    code: err.code,
    stack: config.env === 'development' ? err.stack : undefined
  });

  // Handle operational errors (expected errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Handle Prisma errors
  if (err.code?.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // Handle unexpected errors (programming errors, bugs)
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: config.env === 'development'
        ? err.message
        : 'An unexpected error occurred'
    }
  });
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(err, res) {
  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists',
        details: err.meta
      }
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found'
      }
    });
  }

  // Prisma foreign key constraint violation
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid reference to related resource'
      }
    });
  }

  // Generic Prisma error
  return res.status(500).json({
    error: {
      code: 'DATABASE_ERROR',
      message: 'Database operation failed'
    }
  });
}

/**
 * Catch-all for 404 errors
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
