const organizationsService = require('../services/organizations.service');

/**
 * Get all organizations for user
 */
async function getOrganizations(req, res, next) {
  try {
    const result = await organizationsService.getOrganizations(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single organization by ID
 */
async function getOrganizationById(req, res, next) {
  try {
    const result = await organizationsService.getOrganizationById(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new organization
 */
async function createOrganization(req, res, next) {
  try {
    const organization = await organizationsService.createOrganization(req.user.id, req.body);
    res.status(201).json({ organization });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an organization
 */
async function updateOrganization(req, res, next) {
  try {
    const organization = await organizationsService.updateOrganization(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json({ organization });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an organization
 */
async function deleteOrganization(req, res, next) {
  try {
    const result = await organizationsService.deleteOrganization(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
};
