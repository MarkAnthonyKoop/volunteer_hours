const { z } = require('zod');

const createOrganizationSchema = {
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    description: z.string().optional()
  })
};

const updateOrganizationSchema = {
  params: z.object({
    id: z.string().uuid('Invalid organization ID')
  }),
  body: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long').optional(),
    description: z.string().optional()
  })
};

const getOrganizationSchema = {
  params: z.object({
    id: z.string().uuid('Invalid organization ID')
  })
};

const deleteOrganizationSchema = {
  params: z.object({
    id: z.string().uuid('Invalid organization ID')
  })
};

module.exports = {
  createOrganizationSchema,
  updateOrganizationSchema,
  getOrganizationSchema,
  deleteOrganizationSchema
};
