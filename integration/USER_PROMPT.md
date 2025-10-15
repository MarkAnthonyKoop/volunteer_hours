# Integration Layer for Volunteer Hours Tracker

Integrate all Phase 2 components into a working full-stack application with proper deployment configuration.

## Mission

Bring together the API server, database layer, authentication service, and Phase 1 frontend into a unified, production-ready full-stack application. Create deployment infrastructure, integration tests, and update the frontend to use the backend API.

## What to Integrate

You have these completed sibling projects:
- `../` - Phase 1 frontend (index.html, app.js, styles.css)
- `../api/` - Express API server with all endpoints
- `../database/` - PostgreSQL + Prisma database layer
- `../authentication/` - JWT + OAuth authentication service

## Integration Tasks

### 1. Frontend Integration

Update the Phase 1 frontend (`../index.html`, `../app.js`) to:

**Add Authentication UI:**
- Login form (email/password)
- Register form (email/password/name)
- Google Sign-In button
- Logout button
- Display logged-in user name
- Token management (store JWT in localStorage or sessionStorage)

**Replace localStorage with API calls:**
- Change `loadFromStorage()` → call `GET /api/entries`
- Change `saveToStorage()` → call appropriate API endpoint
- Add entry → `POST /api/entries`
- Update entry → `PUT /api/entries/:id`
- Delete entry → `DELETE /api/entries/:id`
- Get stats → `GET /api/stats/*`

**Add API Client:**
Create `../api-client.js` to handle all API calls:
```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshToken();
      return this.request(endpoint, options);
    }

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async login(email, password) { ... }
  async register(email, password, name) { ... }
  async getEntries(filters) { ... }
  async createEntry(entry) { ... }
  async updateEntry(id, updates) { ... }
  async deleteEntry(id) { ... }
  async getStats() { ... }
}
```

**Offline Support:**
- Keep localStorage as fallback when offline
- Sync to API when connection restored
- Show "Offline" indicator in UI

### 2. Docker Compose Setup

Create `docker-compose.yml` for the full stack:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: volunteer_tracker
      POSTGRES_USER: volunteer
      POSTGRES_PASSWORD: volunteer_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U volunteer"]
      interval: 10s
      timeout: 5s
      retries: 5

  # API Server
  api:
    build: ../api
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://volunteer:volunteer_password@postgres:5432/volunteer_tracker
      JWT_SECRET: development-secret-change-in-production
      JWT_REFRESH_SECRET: development-refresh-secret
      CORS_ORIGIN: http://localhost:8080
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ../api:/app
      - /app/node_modules
    command: npm run dev

  # Frontend (static files served via simple HTTP server)
  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ../:/app
    ports:
      - "8080:8080"
    command: npx http-server -p 8080 -c-1
    environment:
      API_URL: http://localhost:3000

volumes:
  postgres_data:
```

### 3. Environment Configuration

Create `.env` files for each environment:

**`integration/.env.development`:**
```
NODE_ENV=development
API_URL=http://localhost:3000
DATABASE_URL=postgresql://volunteer:volunteer_password@localhost:5432/volunteer_tracker
JWT_SECRET=development-secret-min-32-chars-change-in-production
JWT_REFRESH_SECRET=development-refresh-secret-min-32-chars
CORS_ORIGIN=http://localhost:8080
```

**`integration/.env.production`:**
```
NODE_ENV=production
API_URL=https://api.yourapp.com
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=production-secret-from-env
JWT_REFRESH_SECRET=production-refresh-secret-from-env
CORS_ORIGIN=https://yourapp.com
```

### 4. Integration Tests

Create end-to-end tests that test the full stack:

**Test Auth Flow:**
```javascript
describe('Authentication Flow', () => {
  it('should register, login, and access protected routes', async () => {
    // Register new user
    const registerRes = await request(apiUrl)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Test123!', name: 'Test User' });
    expect(registerRes.status).toBe(201);

    // Login
    const loginRes = await request(apiUrl)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeDefined();

    const token = loginRes.body.accessToken;

    // Access protected route
    const entriesRes = await request(apiUrl)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);
    expect(entriesRes.status).toBe(200);
  });
});
```

**Test Volunteer Entry CRUD:**
```javascript
describe('Volunteer Entries', () => {
  let token;
  let entryId;

  beforeAll(async () => {
    // Login to get token
    const res = await request(apiUrl)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test123!' });
    token = res.body.accessToken;
  });

  it('should create a volunteer entry', async () => {
    const res = await request(apiUrl)
      .post('/api/entries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2024-01-15',
        activity: 'Test Activity',
        hours: 3.5,
        category: 'Testing',
      });
    expect(res.status).toBe(201);
    entryId = res.body.entry.id;
  });

  it('should get all entries', async () => {
    const res = await request(apiUrl)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.entries.length).toBeGreaterThan(0);
  });

  it('should update an entry', async () => { ... });
  it('should delete an entry', async () => { ... });
});
```

**Test Statistics:**
```javascript
describe('Statistics', () => {
  it('should get summary statistics', async () => { ... });
  it('should get hours by organization', async () => { ... });
  it('should get hours by category', async () => { ... });
});
```

### 5. Database Migrations

Set up the database in docker-compose:

**Add init script (`integration/init-db.sh`):**
```bash
#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -U volunteer; do
  sleep 1
done

echo "Running Prisma migrations..."
cd /app/database
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Database initialized!"
```

### 6. Health Checks

Add health check endpoints:

**API Health Check:** `/health`
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: prisma ? 'connected' : 'disconnected',
  });
});
```

### 7. Logging

Set up structured logging:

**Use winston or pino:**
```javascript
const logger = require('winston').createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### 8. Update Frontend App

Modify `../app.js`:

```javascript
// Add at top
const apiClient = new ApiClient('http://localhost:3000');

// Modify VolunteerTracker class
class VolunteerTracker {
  async init() {
    // Check if user is logged in
    if (apiClient.token) {
      await this.loadFromAPI();
    } else {
      this.showLoginForm();
    }
    this.setupEventListeners();
    this.render();
  }

  async loadFromAPI() {
    try {
      const data = await apiClient.getEntries();
      this.entries = data.entries;
    } catch (error) {
      console.error('Failed to load from API, using localStorage', error);
      this.loadFromStorage(); // Fallback
    }
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    const entry = this.getFormData();

    try {
      if (this.currentEditId) {
        await apiClient.updateEntry(this.currentEditId, entry);
      } else {
        await apiClient.createEntry(entry);
      }
      await this.loadFromAPI();
      this.showToast('Saved successfully', 'success');
    } catch (error) {
      // Save to localStorage for offline sync
      this.saveToStorage();
      this.showToast('Saved offline, will sync when online', 'warning');
    }
  }
}
```

## Project Structure

```
integration/
├── docker-compose.yml          # Full stack orchestration
├── docker-compose.prod.yml     # Production config
├── .env.development
├── .env.production
├── .env.test
├── init-db.sh                  # Database initialization
├── tests/
│   ├── setup.js                # Test environment setup
│   ├── auth.e2e.test.js        # Auth integration tests
│   ├── entries.e2e.test.js     # Entries integration tests
│   ├── stats.e2e.test.js       # Stats integration tests
│   └── frontend.e2e.test.js    # Frontend UI tests (optional)
├── scripts/
│   ├── start-dev.sh            # Start development environment
│   ├── start-prod.sh           # Start production environment
│   ├── run-tests.sh            # Run integration tests
│   └── deploy.sh               # Deployment script
├── nginx/                      # Nginx config for production (optional)
│   └── nginx.conf
├── package.json
└── README.md
```

## Testing Requirements

- ✅ Full auth flow (register, login, logout, refresh token)
- ✅ CRUD operations on volunteer entries
- ✅ Statistics endpoints
- ✅ Organizations endpoints
- ✅ Error handling (401, 403, 404, 500)
- ✅ Database persistence
- ✅ Frontend can communicate with API
- ✅ Offline fallback works
- ✅ Docker compose starts successfully
- ✅ All services healthy

## Success Criteria

- ✅ docker-compose up starts all services
- ✅ PostgreSQL is accessible and initialized
- ✅ API server responds at http://localhost:3000
- ✅ API health check returns 200
- ✅ Frontend loads at http://localhost:8080
- ✅ Frontend can register and login users
- ✅ Frontend can create/read/update/delete entries via API
- ✅ Frontend displays stats from API
- ✅ All integration tests pass
- ✅ Logging works
- ✅ README.md with setup instructions

## Development Commands

Add to `integration/package.json`:
```json
{
  "scripts": {
    "dev": "docker-compose up",
    "dev:build": "docker-compose up --build",
    "prod": "docker-compose -f docker-compose.prod.yml up -d",
    "down": "docker-compose down",
    "logs": "docker-compose logs -f",
    "test": "jest tests/",
    "test:e2e": "jest tests/*.e2e.test.js",
    "db:migrate": "cd ../database && npx prisma migrate deploy",
    "db:seed": "cd ../database && npx prisma db seed"
  }
}
```

## Deployment

**For production:**
1. Build frontend: Minify HTML/CSS/JS
2. Build API: Docker image
3. Set up PostgreSQL (managed service recommended)
4. Configure environment variables
5. Deploy API to cloud (Fly.io, Railway, AWS)
6. Deploy frontend to CDN (Vercel, Netlify)
7. Set up monitoring and logging

## Notes

- Keep Phase 1 localStorage functionality as offline fallback
- Use JWT in Authorization header: `Bearer <token>`
- Store tokens securely (consider httpOnly cookies for refresh token)
- Handle token expiration gracefully
- Add loading states in UI
- Show meaningful error messages to users
- Log all important events
- Use connection pooling for database
- Add request timeout handling

## Development Workflow

1. Create docker-compose.yml
2. Add environment files
3. Create integration tests
4. Update frontend to use API
5. Create api-client.js
6. Test locally with docker-compose
7. Fix any integration issues
8. Document deployment process
9. Create production docker-compose
10. Write README.md

Bring it all together into a working, production-ready full-stack application!
