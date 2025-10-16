const { z } = require('zod');

const createEntrySchema = {
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    organizationId: z.string().uuid('Invalid organization ID'),
    activity: z.string().min(1, 'Activity is required').max(500, 'Activity too long'),
    hours: z.number().min(0, 'Hours must be positive').max(999.99, 'Hours too large'),
    category: z.string().max(100, 'Category too long').optional(),
    description: z.string().optional()
  })
};

const updateEntrySchema = {
  params: z.object({
    id: z.string().uuid('Invalid entry ID')
  }),
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
    organizationId: z.string().uuid('Invalid organization ID').optional(),
    activity: z.string().min(1, 'Activity is required').max(500, 'Activity too long').optional(),
    hours: z.number().min(0, 'Hours must be positive').max(999.99, 'Hours too large').optional(),
    category: z.string().max(100, 'Category too long').optional(),
    description: z.string().optional()
  })
};

const getEntrySchema = {
  params: z.object({
    id: z.string().uuid('Invalid entry ID')
  })
};

const deleteEntrySchema = {
  params: z.object({
    id: z.string().uuid('Invalid entry ID')
  })
};

const listEntriesSchema = {
  query: z.object({
    organization: z.string().uuid('Invalid organization ID').optional(),
    category: z.string().optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format').optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
    sort: z.enum(['date', 'hours']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional()
  })
};

module.exports = {
  createEntrySchema,
  updateEntrySchema,
  getEntrySchema,
  deleteEntrySchema,
  listEntriesSchema
};
