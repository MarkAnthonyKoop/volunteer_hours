const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entries.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  createEntrySchema,
  updateEntrySchema,
  getEntrySchema,
  deleteEntrySchema,
  listEntriesSchema
} = require('../validators/entries.validator');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/entries
 * @desc    Get all entries for user with filtering
 * @access  Private
 */
router.get('/', validate(listEntriesSchema), entriesController.getEntries);

/**
 * @route   POST /api/entries
 * @desc    Create a new entry
 * @access  Private
 */
router.post('/', validate(createEntrySchema), entriesController.createEntry);

/**
 * @route   GET /api/entries/:id
 * @desc    Get a single entry by ID
 * @access  Private
 */
router.get('/:id', validate(getEntrySchema), entriesController.getEntryById);

/**
 * @route   PUT /api/entries/:id
 * @desc    Update an entry
 * @access  Private
 */
router.put('/:id', validate(updateEntrySchema), entriesController.updateEntry);

/**
 * @route   DELETE /api/entries/:id
 * @desc    Delete an entry
 * @access  Private
 */
router.delete('/:id', validate(deleteEntrySchema), entriesController.deleteEntry);

module.exports = router;
