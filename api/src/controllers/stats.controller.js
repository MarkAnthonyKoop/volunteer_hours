const statsService = require('../services/stats.service');

/**
 * Get summary statistics
 */
async function getSummary(req, res, next) {
  try {
    const stats = await statsService.getSummary(req.user.id);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * Get statistics by organization
 */
async function getByOrganization(req, res, next) {
  try {
    const stats = await statsService.getStatsByOrganization(req.user.id, req.query);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * Get statistics by category
 */
async function getByCategory(req, res, next) {
  try {
    const stats = await statsService.getStatsByCategory(req.user.id, req.query);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

/**
 * Get statistics by date range
 */
async function getByDateRange(req, res, next) {
  try {
    const stats = await statsService.getStatsByDateRange(req.user.id, req.query);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
  getByOrganization,
  getByCategory,
  getByDateRange
};
