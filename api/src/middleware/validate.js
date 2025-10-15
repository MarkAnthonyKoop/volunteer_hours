const { ValidationError } = require('../utils/errors');

/**
 * Validation middleware factory
 * @param {Object} schema - Zod schema object with optional body, query, params
 * @returns {Function} Express middleware function
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      // Validate request body if schema provided
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query params if schema provided
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      // Validate URL params if schema provided
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        // Format Zod validation errors
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        throw new ValidationError('Validation failed', details);
      }
      throw error;
    }
  };
}

module.exports = validate;
