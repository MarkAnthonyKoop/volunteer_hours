# Authentication Service for Volunteer Hours Tracker

Build a production-ready authentication service with JWT tokens and Google OAuth 2.0 integration for the Volunteer Hours Tracker.

## Mission

Create a secure authentication system that provides user registration, login, Google OAuth integration, password management, and role-based access control. This service will be used by the API server for all authentication needs.

## Technical Stack

- **Core**: Node.js 18+
- **Password Hashing**: bcrypt (12 rounds)
- **JWT**: jsonwebtoken
- **OAuth**: google-auth-library or passport-google-oauth20
- **Testing**: Jest
- **Validation**: Zod

## Authentication Features Required

### 1. Local Authentication (Email/Password)
- User registration with email and password
- Email validation (proper format)
- Password strength requirements (min 8 chars, 1 uppercase, 1 number, 1 special)
- Password hashing with bcrypt (12 rounds)
- Login with email/password
- Logout (token invalidation)

### 2. JWT Token Management
- **Access Tokens**: 15-minute expiry, contains userId, email, role
- **Refresh Tokens**: 7-day expiry, stored securely, can be revoked
- Token signing with RS256 or HS256
- Token verification and validation
- Token refresh mechanism
- Token revocation (blacklist or database flag)

### 3. Google OAuth 2.0
- Google Sign-In integration
- Verify Google ID tokens
- Create or link user accounts
- Store Google ID for future logins
- Handle "Sign in with Google" button flow

### 4. Password Management
- Hash passwords with bcrypt (12 rounds)
- Verify password hashes
- Password reset flow (generate token, send email link, verify token, update password)
- Email verification for new accounts (generate token, send email, verify)

### 5. Role-Based Access Control (RBAC)
- Roles: `user`, `org_admin`, `super_admin`
- Default role: `user`
- Role stored in User table
- Middleware to check roles
- Permission system (future expansion)

## Token Structure

### Access Token Payload
```javascript
{
  userId: 'uuid',
  email: 'user@example.com',
  name: 'User Name',
  role: 'user',
  type: 'access',
  iat: 1234567890,
  exp: 1234568790  // 15 minutes from iat
}
```

### Refresh Token Payload
```javascript
{
  userId: 'uuid',
  type: 'refresh',
  tokenId: 'unique-token-id',  // for revocation
  iat: 1234567890,
  exp: 1234972690  // 7 days from iat
}
```

## Project Structure

```
authentication/
├── src/
│   ├── index.js                    # Exports all auth functions
│   ├── password.js                 # Password hashing & verification
│   ├── jwt.js                      # JWT sign & verify
│   ├── google-oauth.js             # Google OAuth integration
│   ├── email-verification.js       # Email verification logic
│   ├── password-reset.js           # Password reset logic
│   ├── middleware/
│   │   ├── requireAuth.js          # Verify JWT middleware
│   │   ├── requireRole.js          # Check role middleware
│   │   └── rateLimitAuth.js        # Rate limit auth attempts
│   ├── validators/
│   │   ├── auth.validator.js       # Zod schemas
│   │   └── password.validator.js   # Password strength rules
│   └── utils/
│       ├── errors.js               # Custom error classes
│       └── tokens.js               # Token generation utilities
├── tests/
│   ├── password.test.js
│   ├── jwt.test.js
│   ├── google-oauth.test.js
│   ├── middleware.test.js
│   └── validators.test.js
├── .env.example
├── package.json
└── README.md
```

## Core Functions to Implement

### Password Functions (`src/password.js`)

```javascript
/**
 * Hash a password with bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  // bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Bcrypt hash
 * @returns {Promise<boolean>} True if password matches
 */
async function verifyPassword(password, hash) {
  // bcrypt.compare(password, hash)
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePasswordStrength(password) {
  // Min 8 chars, 1 uppercase, 1 number, 1 special
}
```

### JWT Functions (`src/jwt.js`)

```javascript
/**
 * Sign an access token
 * @param {Object} payload - { userId, email, name, role }
 * @returns {string} JWT token
 */
function signAccessToken(payload) {
  // jwt.sign({ ...payload, type: 'access' }, secret, { expiresIn: '15m' })
}

/**
 * Sign a refresh token
 * @param {Object} payload - { userId }
 * @returns {string} JWT token
 */
function signRefreshToken(payload) {
  // jwt.sign({ ...payload, type: 'refresh', tokenId: uuid() }, refreshSecret, { expiresIn: '7d' })
}

/**
 * Verify and decode a token
 * @param {string} token
 * @param {string} type - 'access' or 'refresh'
 * @returns {Object} Decoded payload
 * @throws {Error} If token invalid or expired
 */
function verifyToken(token, type) {
  // jwt.verify(token, secret)
  // Check type matches
}

/**
 * Decode token without verifying (for debugging)
 * @param {string} token
 * @returns {Object} Decoded payload
 */
function decodeToken(token) {
  // jwt.decode(token)
}
```

### Google OAuth Functions (`src/google-oauth.js`)

```javascript
/**
 * Verify Google ID token
 * @param {string} idToken - Token from Google Sign-In
 * @returns {Promise<Object>} { email, name, googleId, picture }
 * @throws {Error} If token invalid
 */
async function verifyGoogleToken(idToken) {
  // Use google-auth-library
  // const client = new OAuth2Client(clientId);
  // const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  // return ticket.getPayload();
}
```

### Email Verification Functions (`src/email-verification.js`)

```javascript
/**
 * Generate email verification token
 * @param {string} userId
 * @returns {string} Verification token (JWT or random)
 */
function generateVerificationToken(userId) {
  // JWT with 24h expiry or crypto.randomBytes(32).toString('hex')
}

/**
 * Verify email verification token
 * @param {string} token
 * @returns {Object} { userId }
 * @throws {Error} If token invalid or expired
 */
function verifyVerificationToken(token) {
  // Verify JWT or check database
}
```

### Password Reset Functions (`src/password-reset.js`)

```javascript
/**
 * Generate password reset token
 * @param {string} userId
 * @returns {string} Reset token
 */
function generateResetToken(userId) {
  // JWT with 1h expiry
}

/**
 * Verify password reset token
 * @param {string} token
 * @returns {Object} { userId }
 * @throws {Error} If token invalid or expired
 */
function verifyResetToken(token) {
  // Verify JWT
}
```

## Middleware Functions

### requireAuth (`src/middleware/requireAuth.js`)

```javascript
/**
 * Express middleware to require authentication
 * Verifies JWT token from Authorization header
 * Attaches user to req.user
 */
function requireAuth(req, res, next) {
  // Extract token from Authorization: Bearer <token>
  // Verify token
  // Attach decoded user to req.user
  // Call next() or send 401
}
```

### requireRole (`src/middleware/requireRole.js`)

```javascript
/**
 * Express middleware to require specific role
 * @param {string|string[]} roles - Required role(s)
 */
function requireRole(roles) {
  return (req, res, next) => {
    // Check req.user.role is in roles array
    // Call next() or send 403
  };
}
```

### rateLimitAuth (`src/middleware/rateLimitAuth.js`)

```javascript
/**
 * Rate limit authentication attempts
 * Max 5 attempts per 15 minutes per IP
 */
const rateLimitAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
});
```

## Validation Schemas (Zod)

### Registration Schema
```javascript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  name: z.string().min(1).max(255),
});
```

### Login Schema
```javascript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```

## Environment Variables

```
JWT_SECRET=your-secret-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
BCRYPT_ROUNDS=12
```

## Testing Requirements

- ✅ Test password hashing and verification
- ✅ Test password strength validation
- ✅ Test JWT signing and verification
- ✅ Test JWT expiration
- ✅ Test invalid tokens
- ✅ Test Google OAuth token verification (mocked)
- ✅ Test requireAuth middleware
- ✅ Test requireRole middleware
- ✅ Test rate limiting
- ✅ Test email verification flow
- ✅ Test password reset flow
- ✅ Test all Zod validators

## Security Best Practices

- ✅ Never log passwords or tokens
- ✅ Use timing-safe comparisons for tokens
- ✅ Validate all inputs
- ✅ Rate limit authentication endpoints
- ✅ Use strong JWT secrets (32+ characters, random)
- ✅ Set appropriate token expiration times
- ✅ Store refresh tokens securely (httpOnly cookies)
- ✅ Implement token revocation
- ✅ Hash passwords with bcrypt (never store plain text)
- ✅ Validate token type (access vs refresh)

## Success Criteria

- ✅ Password hashing works with bcrypt (12 rounds)
- ✅ Password verification works correctly
- ✅ JWT access tokens generated correctly (15min expiry)
- ✅ JWT refresh tokens generated correctly (7day expiry)
- ✅ Token verification works and rejects invalid/expired tokens
- ✅ Google OAuth verification works (can mock for tests)
- ✅ requireAuth middleware works
- ✅ requireRole middleware works
- ✅ All validators work
- ✅ All tests pass (>80% coverage)
- ✅ README.md with usage examples
- ✅ Can be imported as a module by API server

## Usage Example (for API server)

```javascript
// In API server
const auth = require('../authentication');

// Hash password during registration
const passwordHash = await auth.hashPassword(req.body.password);

// Verify password during login
const isValid = await auth.verifyPassword(req.body.password, user.passwordHash);

// Sign tokens after successful login
const accessToken = auth.signAccessToken({ userId: user.id, email: user.email, role: user.role });
const refreshToken = auth.signRefreshToken({ userId: user.id });

// Protect routes
app.get('/api/protected', auth.middleware.requireAuth, (req, res) => {
  // req.user is available
});

// Require admin role
app.delete('/api/admin', auth.middleware.requireAuth, auth.middleware.requireRole('super_admin'), (req, res) => {
  // Only super_admin can access
});

// Verify Google token
const googleUser = await auth.verifyGoogleToken(req.body.idToken);
```

## Development Workflow

1. Initialize Node.js project
2. Install dependencies (bcrypt, jsonwebtoken, google-auth-library, zod, jest)
3. Implement password functions with bcrypt
4. Implement JWT functions
5. Implement Google OAuth verification
6. Create middleware functions
7. Create validators
8. Write comprehensive tests
9. Document in README.md with examples

Build a secure, production-ready authentication service that the API can trust!
