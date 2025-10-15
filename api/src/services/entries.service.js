const { v4: uuidv4 } = require('uuid');
const { getPrismaClient } = require('../utils/db');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

/**
 * Get all entries for a user with filtering and pagination
 */
async function getEntries(userId, filters = {}) {
  const prisma = getPrismaClient();

  const {
    organization,
    category,
    startDate,
    endDate,
    sort = 'date',
    order = 'desc',
    page = 1,
    pageSize = 50
  } = filters;

  // Build where clause
  const where = {
    userId,
    ...(organization && { organizationId: organization }),
    ...(category && { category }),
    ...(startDate || endDate ? {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    } : {})
  };

  // Build orderBy clause
  const orderBy = { [sort]: order };

  // Calculate pagination
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  // Execute query
  const [entries, total] = await Promise.all([
    prisma.volunteerEntry.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        organization: {
          select: { id: true, name: true }
        }
      }
    }),
    prisma.volunteerEntry.count({ where })
  ]);

  return {
    entries,
    total,
    page,
    pageSize
  };
}

/**
 * Get a single entry by ID
 */
async function getEntryById(entryId, userId) {
  const prisma = getPrismaClient();

  const entry = await prisma.volunteerEntry.findUnique({
    where: { id: entryId },
    include: {
      organization: {
        select: { id: true, name: true }
      }
    }
  });

  if (!entry) {
    throw new NotFoundError('Entry not found');
  }

  // Verify user owns this entry
  if (entry.userId !== userId) {
    throw new AuthorizationError('Not authorized to access this entry');
  }

  return entry;
}

/**
 * Create a new volunteer entry
 */
async function createEntry(userId, data) {
  const prisma = getPrismaClient();

  const entry = await prisma.volunteerEntry.create({
    data: {
      id: uuidv4(),
      userId,
      organizationId: data.organizationId,
      date: new Date(data.date),
      activity: data.activity,
      hours: data.hours,
      category: data.category || null,
      description: data.description || null,
      verified: false
    },
    include: {
      organization: {
        select: { id: true, name: true }
      }
    }
  });

  return entry;
}

/**
 * Update an existing entry
 */
async function updateEntry(entryId, userId, data) {
  const prisma = getPrismaClient();

  // Check if entry exists and user owns it
  const existingEntry = await prisma.volunteerEntry.findUnique({
    where: { id: entryId }
  });

  if (!existingEntry) {
    throw new NotFoundError('Entry not found');
  }

  if (existingEntry.userId !== userId) {
    throw new AuthorizationError('Not authorized to update this entry');
  }

  // Update entry
  const entry = await prisma.volunteerEntry.update({
    where: { id: entryId },
    data: {
      ...(data.organizationId && { organizationId: data.organizationId }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.activity && { activity: data.activity }),
      ...(data.hours !== undefined && { hours: data.hours }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.description !== undefined && { description: data.description }),
      updatedAt: new Date()
    },
    include: {
      organization: {
        select: { id: true, name: true }
      }
    }
  });

  return entry;
}

/**
 * Delete an entry
 */
async function deleteEntry(entryId, userId) {
  const prisma = getPrismaClient();

  // Check if entry exists and user owns it
  const entry = await prisma.volunteerEntry.findUnique({
    where: { id: entryId }
  });

  if (!entry) {
    throw new NotFoundError('Entry not found');
  }

  if (entry.userId !== userId) {
    throw new AuthorizationError('Not authorized to delete this entry');
  }

  // Delete entry
  await prisma.volunteerEntry.delete({
    where: { id: entryId }
  });

  return { message: 'Entry deleted successfully' };
}

module.exports = {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry
};
