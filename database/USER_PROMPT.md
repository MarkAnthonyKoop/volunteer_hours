# Database Layer for Volunteer Hours Tracker

Build a production-ready database layer using PostgreSQL and Prisma ORM for the Volunteer Hours Tracker application.

## Mission

Create a complete database schema, migrations, seed data, and utilities for managing volunteer hours data. This will provide the data persistence layer for the API server.

## Technical Stack

- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Migration Tool**: Prisma Migrate
- **Testing**: Jest with Prisma Client
- **Backup**: Custom PostgreSQL scripts

## Complete Database Schema

Create a Prisma schema file (`prisma/schema.prisma`) with the following tables:

### Users Table
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String
  passwordHash  String?  @map("password_hash")
  googleId      String?  @unique @map("google_id")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  volunteerEntries VolunteerEntry[]
  adminOrganizations Organization[] @relation("AdminOrganizations")
  orgMemberships   OrgMember[]

  @@map("users")
}
```

### Organizations Table
```prisma
model Organization {
  id          String   @id @default(uuid())
  name        String
  description String?
  adminUserId String   @map("admin_user_id")
  createdAt   DateTime @default(now()) @map("created_at")

  admin           User              @relation("AdminOrganizations", fields: [adminUserId], references: [id])
  volunteerEntries VolunteerEntry[]
  members         OrgMember[]

  @@map("organizations")
}
```

### Volunteer Entries Table
```prisma
model VolunteerEntry {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  organizationId String?  @map("organization_id")
  date           DateTime @db.Date
  activity       String   @db.VarChar(500)
  hours          Decimal  @db.Decimal(5, 2)
  category       String?  @db.VarChar(100)
  description    String?  @db.Text
  verified       Boolean  @default(false)
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization? @relation(fields: [organizationId], references: [id])

  @@index([userId, date(sort: Desc)])
  @@index([organizationId])
  @@map("volunteer_entries")
}
```

### Organization Members Table
```prisma
model OrgMember {
  organizationId String   @map("organization_id")
  userId         String   @map("user_id")
  role           String   @default("member") @db.VarChar(50)
  joinedAt       DateTime @default(now()) @map("joined_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([organizationId, userId])
  @@map("org_members")
}
```

### Sync Status Table (for future Google Drive integration)
```prisma
model SyncStatus {
  id          String   @id @default(uuid())
  entryId     String   @unique @map("entry_id")
  driveFileId String?  @map("drive_file_id")
  lastSynced  DateTime @map("last_synced")
  status      String   @db.VarChar(50)

  @@index([status])
  @@map("sync_status")
}
```

## Prisma Configuration

The `schema.prisma` file should also include:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Required Migrations

Create migrations for:
1. Initial schema setup (all 5 tables)
2. Indexes for performance:
   - `volunteer_entries(user_id, date DESC)`
   - `volunteer_entries(organization_id)`
   - `sync_status(status)`
3. Check constraints:
   - `volunteer_entries.hours >= 0`

## Seed Data

Create `prisma/seed.js` (or `seed.ts`) with:

### Test Users (3-5 users)
```javascript
const users = [
  {
    email: 'john@example.com',
    name: 'John Doe',
    passwordHash: await bcrypt.hash('password123', 12),
  },
  {
    email: 'jane@example.com',
    name: 'Jane Smith',
    passwordHash: await bcrypt.hash('password123', 12),
  },
  {
    email: 'bob@example.com',
    name: 'Bob Johnson',
    googleId: 'google_123456789',
  },
];
```

### Test Organizations (3-5 organizations)
```javascript
const organizations = [
  {
    name: 'Local Food Bank',
    description: 'Helping families in need with food assistance',
    adminUserId: users[0].id,
  },
  {
    name: 'Animal Shelter',
    description: 'Caring for abandoned and rescued animals',
    adminUserId: users[1].id,
  },
  {
    name: 'Community Library',
    description: 'Promoting literacy and education',
    adminUserId: users[0].id,
  },
];
```

### Test Volunteer Entries (10-20 entries)
```javascript
const entries = [
  {
    userId: users[0].id,
    organizationId: orgs[0].id,
    date: new Date('2024-01-15'),
    activity: 'Food sorting and distribution',
    hours: 3.5,
    category: 'Social Services',
    description: 'Helped sort and pack food donations',
    verified: true,
  },
  {
    userId: users[0].id,
    organizationId: orgs[1].id,
    date: new Date('2024-01-20'),
    activity: 'Dog walking',
    hours: 2.0,
    category: 'Animal Welfare',
    verified: false,
  },
  // Add more varied entries...
];
```

### Organization Members
```javascript
const memberships = [
  {
    organizationId: orgs[0].id,
    userId: users[1].id,
    role: 'volunteer',
  },
  {
    organizationId: orgs[1].id,
    userId: users[2].id,
    role: 'volunteer',
  },
];
```

## Project Structure

```
database/
├── prisma/
│   ├── schema.prisma           # Prisma schema file
│   ├── migrations/             # Migration files (generated)
│   └── seed.js                 # Seed data script
├── scripts/
│   ├── backup.sh               # PostgreSQL backup script
│   ├── restore.sh              # PostgreSQL restore script
│   └── reset-db.sh             # Reset database to clean state
├── src/
│   ├── client.js               # Prisma client singleton
│   └── queries.js              # Common query utilities (optional)
├── tests/
│   ├── setup.js                # Test database setup
│   ├── schema.test.js          # Test schema integrity
│   ├── queries.test.js         # Test queries
│   └── seed.test.js            # Test seed data
├── .env.example
├── package.json
└── README.md
```

## Required Scripts

### Backup Script (`scripts/backup.sh`)
```bash
#!/bin/bash
# Backup PostgreSQL database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/volunteer_tracker_${TIMESTAMP}.sql
echo "Backup created: volunteer_tracker_${TIMESTAMP}.sql"
```

### Restore Script (`scripts/restore.sh`)
```bash
#!/bin/bash
# Restore PostgreSQL database from backup
if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  exit 1
fi
psql $DATABASE_URL < $1
echo "Database restored from $1"
```

### Reset Database Script (`scripts/reset-db.sh`)
```bash
#!/bin/bash
# Reset database to clean state
npx prisma migrate reset --force
npx prisma db seed
echo "Database reset and seeded"
```

## Prisma Client Usage

Create a singleton Prisma client (`src/client.js`):

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});

// Handle shutdown gracefully
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
```

## Testing Requirements

- ✅ Test database connection
- ✅ Test all models can be created
- ✅ Test relationships work correctly
- ✅ Test indexes exist
- ✅ Test constraints are enforced
- ✅ Test seed data creates successfully
- ✅ Use in-memory SQLite for tests (optional) or test database

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/volunteer_tracker
DATABASE_URL_TEST=postgresql://user:password@localhost:5432/volunteer_tracker_test
```

## Package.json Scripts

Add these to package.json:
```json
{
  "scripts": {
    "db:migrate": "npx prisma migrate dev",
    "db:generate": "npx prisma generate",
    "db:seed": "npx prisma db seed",
    "db:reset": "npx prisma migrate reset",
    "db:studio": "npx prisma studio",
    "db:push": "npx prisma db push",
    "test": "jest"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

## Success Criteria

- ✅ Prisma schema defines all 5 tables correctly
- ✅ Migrations run successfully
- ✅ Seed data populates database with test data
- ✅ Prisma Client can be imported and used
- ✅ All relationships work (foreign keys)
- ✅ Indexes are created
- ✅ Check constraints work (hours >= 0)
- ✅ Backup/restore scripts work
- ✅ Tests pass
- ✅ README.md with setup instructions

## Notes

- Use UUID for all primary keys
- Use camelCase in Prisma schema, snake_case in database (use @map)
- Timestamps should be automatic (createdAt, updatedAt)
- Use @db.Decimal(5,2) for hours (max 999.99 hours)
- Use @db.Date for dates (no time component)
- Cascade deletes for volunteer entries when user is deleted
- Cascade deletes for org members when org or user is deleted

## Development Workflow

1. Initialize Node.js project
2. Install Prisma: `npm install prisma @prisma/client`
3. Initialize Prisma: `npx prisma init`
4. Write schema.prisma with all models
5. Create initial migration: `npx prisma migrate dev --name init`
6. Write seed.js with test data
7. Configure package.json seed script
8. Run seed: `npm run db:seed`
9. Create backup/restore scripts
10. Write tests
11. Document in README.md

Build a robust database layer that's properly indexed, seeded with realistic test data, and ready for production use!
