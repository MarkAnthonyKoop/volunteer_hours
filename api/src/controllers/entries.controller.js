const entriesService = require('../services/entries.service');

/**
 * Get all entries for authenticated user
 */
async function getEntries(req, res, next) {
  try {
    const result = await entriesService.getEntries(req.user.id, req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single entry by ID
 */
async function getEntryById(req, res, next) {
  try {
    const entry = await entriesService.getEntryById(req.params.id, req.user.id);
    res.status(200).json({ entry });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new entry
 */
async function createEntry(req, res, next) {
  try {
    const entry = await entriesService.createEntry(req.user.id, req.body);
    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing entry
 */
async function updateEntry(req, res, next) {
  try {
    const entry = await entriesService.updateEntry(req.params.id, req.user.id, req.body);
    res.status(200).json({ entry });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an entry
 */
async function deleteEntry(req, res, next) {
  try {
    const result = await entriesService.deleteEntry(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry
};
