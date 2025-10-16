const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/stats/summary
 * @desc    Get summary statistics
 * @access  Private
 */
router.get('/summary', statsController.getSummary);

/**
 * @route   GET /api/stats/by-organization
 * @desc    Get statistics by organization
 * @access  Private
 */
router.get('/by-organization', statsController.getByOrganization);

/**
 * @route   GET /api/stats/by-category
 * @desc    Get statistics by category
 * @access  Private
 */
router.get('/by-category', statsController.getByCategory);

/**
 * @route   GET /api/stats/by-date-range
 * @desc    Get statistics by date range
 * @access  Private
 */
router.get('/by-date-range', statsController.getByDateRange);

module.exports = router;
