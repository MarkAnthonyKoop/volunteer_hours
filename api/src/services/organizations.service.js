const { v4: uuidv4 } = require('uuid');
const { getPrismaClient } = require('../utils/db');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * Get all organizations for a user (ones they've used in entries)
 */
async function getOrganizations(userId) {
  const prisma = getPrismaClient();

  // Get all organizations the user has entries for
  const entries = await prisma.volunteerEntry.findMany({
    where: { userId },
    distinct: ['organizationId'],
    select: { organizationId: true }
  });

  const orgIds = entries.map(e => e.organizationId);

  const organizations = await prisma.organization.findMany({
    where: { id: { in: orgIds } }
  });

  return { organizations };
}

/**
 * Get a single organization by ID with members
 */
async function getOrganizationById(orgId, userId) {
  const prisma = getPrismaClient();

  const organization = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!organization) {
    throw new NotFoundError('Organization not found');
  }

  // Get members
  const members = await prisma.orgMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return {
    organization,
    members: members.map(m => ({
      ...m.user,
      role: m.role,
      joinedAt: m.joinedAt
    }))
  };
}

/**
 * Create a new organization
 */
async function createOrganization(userId, data) {
  const prisma = getPrismaClient();

  const organization = await prisma.organization.create({
    data: {
      id: uuidv4(),
      name: data.name,
      description: data.description || null,
      adminUserId: userId
    }
  });

  // Add creator as admin member
  await prisma.orgMember.create({
    data: {
      organizationId: organization.id,
      userId,
      role: 'admin'
    }
  });

  return organization;
}

/**
 * Update an organization
 */
async function updateOrganization(orgId, userId, data) {
  const prisma = getPrismaClient();

  // Check if organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!organization) {
    throw new NotFoundError('Organization not found');
  }

  // Check if user is admin
  if (organization.adminUserId !== userId) {
    throw new AuthorizationError('Only organization admin can update organization');
  }

  // Update organization
  const updated = await prisma.organization.update({
    where: { id: orgId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      updatedAt: new Date()
    }
  });

  return updated;
}

/**
 * Delete an organization
 */
async function deleteOrganization(orgId, userId) {
  const prisma = getPrismaClient();

  // Check if organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!organization) {
    throw new NotFoundError('Organization not found');
  }

  // Check if user is admin
  if (organization.adminUserId !== userId) {
    throw new AuthorizationError('Only organization admin can delete organization');
  }

  // Delete organization (cascade will handle members)
  await prisma.organization.delete({
    where: { id: orgId }
  });

  return { message: 'Organization deleted successfully' };
}

module.exports = {
  getOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization
};
