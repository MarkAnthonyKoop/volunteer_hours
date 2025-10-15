const authService = require('../services/auth.service');

/**
 * Register a new user
 */
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Google OAuth login
 */
async function googleAuth(req, res, next) {
  try {
    const result = await authService.googleAuth(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Refresh access token
 */
async function refresh(req, res, next) {
  try {
    const result = await authService.refreshAccessToken(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 */
async function logout(req, res, next) {
  try {
    const result = await authService.logout();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  googleAuth,
  refresh,
  logout
};
