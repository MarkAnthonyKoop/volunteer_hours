// Database client wrapper
// This will use Prisma Client from the sibling database/ project
// For now, we'll create a mock that can be replaced when the database project is ready

let prismaClient = null;

/**
 * Get Prisma Client instance
 * @returns {Object} Prisma Client instance
 */
function getPrismaClient() {
  if (!prismaClient) {
    try {
      // Try to import from sibling database project
      const { PrismaClient } = require('@prisma/client');
      prismaClient = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
      });
    } catch (error) {
      console.warn('Prisma Client not available. Using mock client for development.');
      // Create a mock client for development/testing
      prismaClient = createMockClient();
    }
  }
  return prismaClient;
}

/**
 * Create a mock Prisma client for development
 * This allows the API to run without the database project
 */
function createMockClient() {
  return {
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
      update: async (data) => ({ id: data.where.id, ...data.data }),
      delete: async (data) => ({ id: data.where.id })
    },
    organization: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
      update: async (data) => ({ id: data.where.id, ...data.data }),
      delete: async (data) => ({ id: data.where.id })
    },
    volunteerEntry: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
      update: async (data) => ({ id: data.where.id, ...data.data }),
      delete: async (data) => ({ id: data.where.id }),
      aggregate: async () => ({ _sum: { hours: 0 }, _count: { id: 0 } }),
      groupBy: async () => []
    },
    orgMember: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data) => data.data,
      delete: async (data) => data.where
    },
    $disconnect: async () => {},
    $connect: async () => {}
  };
}

/**
 * Disconnect from database
 */
async function disconnectDB() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

module.exports = {
  getPrismaClient,
  disconnectDB
};
