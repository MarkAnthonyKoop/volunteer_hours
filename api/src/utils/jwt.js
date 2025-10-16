const jwt = require('jsonwebtoken');
const config = require('../config');
const { AuthenticationError } = require('./errors');

/**
 * Generate an access token
 * @param {Object} payload - The payload to encode in the token
 * @returns {string} The signed JWT token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

/**
 * Generate a refresh token
 * @param {Object} payload - The payload to encode in the token
 * @returns {string} The signed JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });
}

/**
 * Verify an access token
 * @param {string} token - The token to verify
 * @returns {Object} The decoded token payload
 * @throws {AuthenticationError} If token is invalid or expired
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid access token');
    }
    throw new AuthenticationError('Token verification failed');
  }
}

/**
 * Verify a refresh token
 * @param {string} token - The refresh token to verify
 * @returns {Object} The decoded token payload
 * @throws {AuthenticationError} If token is invalid or expired
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid refresh token');
    }
    throw new AuthenticationError('Token verification failed');
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
