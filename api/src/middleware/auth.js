const { verifyAccessToken } = require('../utils/jwt');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token and get payload
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware - attaches user if token is valid, but doesn't require it
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate
};
