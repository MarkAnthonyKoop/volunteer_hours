const { getPrismaClient } = require('../utils/db');

/**
 * Get summary statistics for a user
 */
async function getSummary(userId) {
  const prisma = getPrismaClient();

  // Get total hours and entries
  const totals = await prisma.volunteerEntry.aggregate({
    where: { userId },
    _sum: { hours: true },
    _count: { id: true }
  });

  // Get unique organizations count
  const organizations = await prisma.volunteerEntry.findMany({
    where: { userId },
    distinct: ['organizationId'],
    select: { organizationId: true }
  });

  // Get this month's hours
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const thisMonthTotals = await prisma.volunteerEntry.aggregate({
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    },
    _sum: { hours: true }
  });

  return {
    totalHours: totals._sum.hours || 0,
    totalEntries: totals._count.id || 0,
    organizationsCount: organizations.length,
    thisMonthHours: thisMonthTotals._sum.hours || 0
  };
}

/**
 * Get statistics grouped by organization
 */
async function getStatsByOrganization(userId, { startDate, endDate } = {}) {
  const prisma = getPrismaClient();

  // Build where clause
  const where = {
    userId,
    ...(startDate || endDate ? {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    } : {})
  };

  // Group by organization
  const stats = await prisma.volunteerEntry.groupBy({
    by: ['organizationId'],
    where,
    _sum: { hours: true }
  });

  // Get organization names
  const orgIds = stats.map(s => s.organizationId);
  const organizations = await prisma.organization.findMany({
    where: { id: { in: orgIds } },
    select: { id: true, name: true }
  });

  const orgMap = Object.fromEntries(organizations.map(o => [o.id, o.name]));

  return {
    stats: stats.map(s => ({
      organizationId: s.organizationId,
      organizationName: orgMap[s.organizationId] || 'Unknown',
      hours: s._sum.hours || 0
    }))
  };
}

/**
 * Get statistics grouped by category
 */
async function getStatsByCategory(userId, { startDate, endDate } = {}) {
  const prisma = getPrismaClient();

  // Build where clause
  const where = {
    userId,
    ...(startDate || endDate ? {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    } : {})
  };

  // Group by category
  const stats = await prisma.volunteerEntry.groupBy({
    by: ['category'],
    where,
    _sum: { hours: true }
  });

  return {
    stats: stats.map(s => ({
      category: s.category || 'Uncategorized',
      hours: s._sum.hours || 0
    }))
  };
}

/**
 * Get statistics grouped by date range
 */
async function getStatsByDateRange(userId, { startDate, endDate, groupBy = 'day' } = {}) {
  const prisma = getPrismaClient();

  // Build where clause
  const where = {
    userId,
    ...(startDate || endDate ? {
      date: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    } : {})
  };

  // Get all entries in date range
  const entries = await prisma.volunteerEntry.findMany({
    where,
    select: { date: true, hours: true },
    orderBy: { date: 'asc' }
  });

  // Group by specified period
  const grouped = {};

  entries.forEach(entry => {
    const date = new Date(entry.date);
    let key;

    switch (groupBy) {
      case 'week':
        // Get start of week (Monday)
        const dayOfWeek = date.getDay();
        const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(date.setDate(diff));
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'day':
      default:
        key = date.toISOString().split('T')[0];
        break;
    }

    grouped[key] = (grouped[key] || 0) + entry.hours;
  });

  return {
    stats: Object.entries(grouped).map(([date, hours]) => ({
      date,
      hours
    }))
  };
}

module.exports = {
  getSummary,
  getStatsByOrganization,
  getStatsByCategory,
  getStatsByDateRange
};
