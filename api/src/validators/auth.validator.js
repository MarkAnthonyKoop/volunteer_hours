const { z } = require('zod');

const registerSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(1, 'Name is required').max(255, 'Name too long')
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

const googleAuthSchema = {
  body: z.object({
    googleToken: z.string().min(1, 'Google token is required')
  })
};

const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
};

module.exports = {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenSchema
};
