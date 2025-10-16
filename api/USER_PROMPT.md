# API Server for Volunteer Hours Tracker

Build a production-ready RESTful API server for the Volunteer Hours Tracker application.

## Mission

Create a Node.js/Express API that provides secure, scalable backend services for volunteer hours tracking. This API will replace the frontend's localStorage with proper server-side persistence, authentication, and multi-user support.

## Technical Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI 3.0
- **Container**: Docker

## Database Schema Reference

The database layer (sibling project) uses these tables:

```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Organizations table
organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  admin_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
)

-- Volunteer Entries table
volunteer_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  date DATE NOT NULL,
  activity VARCHAR(500) NOT NULL,
  hours DECIMAL(5,2) NOT NULL CHECK (hours >= 0),
  category VARCHAR(100),
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Organization Members table
org_members (
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (organization_id, user_id)
)
```

## Required API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register
  Body: { email, password, name }
  Returns: { user, accessToken, refreshToken }

POST   /api/auth/login
  Body: { email, password }
  Returns: { user, accessToken, refreshToken }

POST   /api/auth/google
  Body: { googleToken }
  Returns: { user, accessToken, refreshToken }

POST   /api/auth/refresh
  Body: { refreshToken }
  Returns: { accessToken }

POST   /api/auth/logout
  Headers: Authorization: Bearer {token}
  Returns: { message }
```

### Volunteer Entries Endpoints

```
GET    /api/entries
  Headers: Authorization: Bearer {token}
  Query: ?organization=uuid&category=string&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&sort=date|hours&order=asc|desc
  Returns: { entries: [...], total, page, pageSize }

POST   /api/entries
  Headers: Authorization: Bearer {token}
  Body: { date, organizationId, activity, hours, category?, description? }
  Returns: { entry }

GET    /api/entries/:id
  Headers: Authorization: Bearer {token}
  Returns: { entry }

PUT    /api/entries/:id
  Headers: Authorization: Bearer {token}
  Body: { date?, organizationId?, activity?, hours?, category?, description? }
  Returns: { entry }

DELETE /api/entries/:id
  Headers: Authorization: Bearer {token}
  Returns: { message }
```

### Statistics Endpoints

```
GET    /api/stats/summary
  Headers: Authorization: Bearer {token}
  Returns: { totalHours, totalEntries, organizationsCount, thisMonthHours }

GET    /api/stats/by-organization
  Headers: Authorization: Bearer {token}
  Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  Returns: { stats: [{ organizationId, organizationName, hours }] }

GET    /api/stats/by-category
  Headers: Authorization: Bearer {token}
  Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  Returns: { stats: [{ category, hours }] }

GET    /api/stats/by-date-range
  Headers: Authorization: Bearer {token}
  Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&groupBy=day|week|month
  Returns: { stats: [{ date, hours }] }
```

### Organizations Endpoints

```
GET    /api/organizations
  Headers: Authorization: Bearer {token}
  Returns: { organizations: [...] }

POST   /api/organizations
  Headers: Authorization: Bearer {token}
  Body: { name, description? }
  Returns: { organization }

GET    /api/organizations/:id
  Headers: Authorization: Bearer {token}
  Returns: { organization, members: [...] }

PUT    /api/organizations/:id
  Headers: Authorization: Bearer {token}
  Body: { name?, description? }
  Returns: { organization }

DELETE /api/organizations/:id
  Headers: Authorization: Bearer {token}
  Returns: { message }
```

## Required Features

### Security
- ✅ JWT authentication with access tokens (15 min expiry)
- ✅ Refresh tokens (7 day expiry, httpOnly cookies)
- ✅ Rate limiting (express-rate-limit): 100 req/15min per IP
- ✅ Helmet.js for security headers
- ✅ CORS configuration (allow localhost:8080, configurable origins)
- ✅ Input validation with Zod on all endpoints
- ✅ XSS protection (sanitize inputs)
- ✅ Password hashing with bcrypt (12 rounds) - integration with auth module

### Error Handling
- ✅ Global error handler middleware
- ✅ Consistent error response format: `{ error: { code, message, details? } }`
- ✅ HTTP status codes: 200, 201, 400, 401, 403, 404, 409, 429, 500
- ✅ Validation errors return field-level details

### Middleware
- ✅ Body parser (express.json)
- ✅ CORS middleware
- ✅ Helmet middleware
- ✅ Rate limiting middleware
- ✅ JWT authentication middleware (verify token, attach user to req)
- ✅ Request logging (morgan or custom)
- ✅ Error handler middleware

### API Documentation
- ✅ Swagger/OpenAPI 3.0 specification
- ✅ Swagger UI at /api/docs
- ✅ All endpoints documented with request/response schemas
- ✅ Authentication documented

### Database Integration
- ✅ Connect to PostgreSQL via environment variables
- ✅ Use Prisma Client (from sibling database/ project)
- ✅ Handle database errors gracefully
- ✅ Transaction support where needed

## Project Structure

```
api/
├── src/
│   ├── index.js                 # Entry point, server setup
│   ├── app.js                   # Express app configuration
│   ├── config/
│   │   └── index.js             # Configuration (env vars)
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── validate.js          # Zod validation middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── rateLimiter.js       # Rate limiting config
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── entries.routes.js    # Volunteer entries endpoints
│   │   ├── stats.routes.js      # Statistics endpoints
│   │   └── organizations.routes.js  # Organizations endpoints
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── entries.controller.js
│   │   ├── stats.controller.js
│   │   └── organizations.controller.js
│   ├── services/
│   │   ├── auth.service.js      # Auth business logic
│   │   ├── entries.service.js   # Entries business logic
│   │   ├── stats.service.js     # Stats calculations
│   │   └── organizations.service.js
│   ├── validators/
│   │   ├── auth.validator.js    # Zod schemas for auth
│   │   ├── entries.validator.js # Zod schemas for entries
│   │   └── organizations.validator.js
│   └── utils/
│       ├── jwt.js               # JWT utilities (sign, verify)
│       └── errors.js            # Custom error classes
├── tests/
│   ├── setup.js                 # Test setup
│   ├── auth.test.js
│   ├── entries.test.js
│   ├── stats.test.js
│   └── organizations.test.js
├── swagger/
│   └── openapi.yaml             # OpenAPI specification
├── .env.example
├── .gitignore
├── package.json
├── Dockerfile
├── .dockerignore
└── README.md
```

## Testing Requirements

- ✅ Jest as test runner
- ✅ Supertest for HTTP testing
- ✅ Unit tests for services and utilities
- ✅ Integration tests for all endpoints
- ✅ Test coverage > 80%
- ✅ Mock database for tests
- ✅ Test authentication flows
- ✅ Test validation errors
- ✅ Test rate limiting
- ✅ Test error handling

## Environment Variables

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/volunteer_tracker
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
GOOGLE_CLIENT_ID=your-google-client-id
```

## Docker Support

Create a Dockerfile:
- Node 18 alpine base image
- Install dependencies
- Copy source code
- Expose port 3000
- Health check endpoint
- Run as non-root user

## Success Criteria

- ✅ All 22 endpoints implemented and working
- ✅ JWT authentication working with access + refresh tokens
- ✅ All endpoints require authentication (except auth endpoints)
- ✅ Input validation on all endpoints
- ✅ Swagger UI accessible at /api/docs
- ✅ All tests passing (>80% coverage)
- ✅ Docker image builds successfully
- ✅ Server starts without errors
- ✅ README.md with setup instructions
- ✅ Health check endpoint at /health returns 200

## Notes

- The database/ sibling project will provide Prisma Client - import it as: `const { PrismaClient } = require('@prisma/client')`
- The authentication/ sibling project will provide password hashing utilities - you can integrate or implement bcrypt directly
- Follow REST best practices
- Use async/await for all async operations
- Log important events (server start, errors, auth attempts)
- Make sure error messages don't leak sensitive information

## Development Workflow

1. Initialize Node.js project with npm init
2. Install dependencies (express, zod, jsonwebtoken, bcrypt, etc.)
3. Set up project structure
4. Implement middleware (auth, validation, error handling)
5. Implement routes and controllers
6. Add Swagger documentation
7. Write tests for all endpoints
8. Create Dockerfile
9. Document in README.md

Build a production-quality API that's secure, well-tested, and properly documented!
