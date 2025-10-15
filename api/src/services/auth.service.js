const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getPrismaClient } = require('../utils/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { AuthenticationError, ConflictError } = require('../utils/errors');

const SALT_ROUNDS = 12;

/**
 * Register a new user
 */
async function register({ email, password, name }) {
  const prisma = getPrismaClient();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name,
      passwordHash
    }
  });

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    accessToken,
    refreshToken
  };
}

/**
 * Login user with email and password
 */
async function login({ email, password }) {
  const prisma = getPrismaClient();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.passwordHash) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    accessToken,
    refreshToken
  };
}

/**
 * Login/register user with Google OAuth
 */
async function googleAuth({ googleToken }) {
  // TODO: Verify Google token with Google OAuth API
  // For now, this is a placeholder that needs Google OAuth integration
  throw new Error('Google OAuth not yet implemented');

  // Implementation would:
  // 1. Verify googleToken with Google API
  // 2. Extract user info (email, name, googleId)
  // 3. Find or create user in database
  // 4. Generate and return tokens
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken({ refreshToken }) {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email
  });

  return { accessToken };
}

/**
 * Logout user (in a stateless JWT system, this is client-side)
 * Server-side logout would require token blacklisting
 */
async function logout() {
  // In a stateless JWT system, logout is handled client-side by removing tokens
  // For enhanced security, you could implement token blacklisting here
  return { message: 'Logged out successfully' };
}

module.exports = {
  register,
  login,
  googleAuth,
  refreshAccessToken,
  logout
};
