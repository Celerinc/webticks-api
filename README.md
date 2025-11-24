# WebTicks API

A production-ready NestJS REST API backend for collecting analytics data from a custom JavaScript analytics library.

## Features

- **Dual Authentication System**:
  - API Key authentication for tracker clients (data ingestion)
  - JWT authentication for admin users (management operations)
- **Analytics Event Collection**: Supports multiple event types (pageview, custom, server_request)
- **Secure API Key Management**: Hashed storage with one-time display
- **Production-Ready**: Includes validation, error handling, and proper security practices

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Passport.js (JWT + Local strategies)
- **Validation**: class-validator & class-transformer
- **Security**: bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (recommended) or npm

## Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing (change in production!)

3. Set up the database:

```bash
# Generate Prisma Client
pnpm run prisma:generate

# Run migrations
pnpm run prisma:migrate

# Seed initial admin user
pnpm run prisma:seed
```

The seed script creates an admin user:
- **Email**: `admin@example.com`
- **Password**: `password123`

**⚠️ Change these credentials in production!**

4. Start the development server:

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication (Admin)

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use this token in the `Authorization: Bearer <token>` header for protected endpoints.

### API Key Management (Protected - Requires JWT)

#### Create API Key
```http
POST /api/keys
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "My Tracker Client" // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "key": "abc123...",
  "message": "Store this key securely. It will not be shown again."
}
```

**⚠️ Important**: The raw API key is only returned once. Store it securely!

### Analytics Ingestion (Protected - Requires API Key)

#### Track Events
```http
POST /api/track
x-api-key: <your-api-key>
Content-Type: application/json

{
  "uid": "user-123", // optional
  "sessionId": "session-456",
  "datetime": "2024-01-15T10:30:00Z",
  "events": [
    {
      "type": "pageview",
      "path": "/home",
      "requestId": "req-789",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "type": "custom",
      "name": "button_click",
      "details": { "buttonId": "submit" },
      "path": "/home",
      "requestId": "req-790",
      "timestamp": "2024-01-15T10:30:01Z"
    },
    {
      "type": "server_request",
      "method": "GET",
      "path": "/api/data",
      "query": { "page": "1" },
      "headers": { "user-agent": "..." },
      "requestId": "req-791",
      "timestamp": "2024-01-15T10:30:02Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "eventsProcessed": 3
}
```

## Event Types

### PageView Event
```typescript
{
  type: 'pageview';
  path: string;
  requestId: string;
  timestamp: string; // ISO 8601
}
```

### Custom Event
```typescript
{
  type: 'custom';
  name: string;
  details: Record<string, any>;
  path?: string; // optional
  requestId: string;
  timestamp: string; // ISO 8601
}
```

### Server Request Event
```typescript
{
  type: 'server_request';
  method: string;
  path: string;
  query?: Record<string, any>; // optional
  headers?: Record<string, any>; // optional
  requestId: string;
  timestamp: string; // ISO 8601
}
```

## Project Structure

```
src/
├── auth/              # Admin authentication (JWT)
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   └── auth.module.ts
├── api-keys/          # API Key management
│   ├── dto/
│   ├── guards/
│   └── api-keys.module.ts
├── track/             # Analytics ingestion
│   ├── dto/
│   └── track.module.ts
├── prisma/            # Prisma service
│   └── prisma.module.ts
└── main.ts            # Application entry point

prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Database seeding script
```

## Database Schema

- **Admin**: Admin users for JWT authentication
- **ApiKey**: API keys for tracker client authentication (hashed)
- **AnalyticsEvent**: Stored analytics events with JSON event data

## Scripts

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Run production build
- `pnpm run prisma:generate` - Generate Prisma Client
- `pnpm run prisma:migrate` - Run database migrations
- `pnpm run prisma:seed` - Seed database with initial admin user
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests

## Security Considerations

1. **Change Default Credentials**: Update the admin email/password in production
2. **Use Strong JWT Secret**: Generate a secure random string for `JWT_SECRET`
3. **Secure Database**: Use strong database credentials and restrict access
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Consider adding rate limiting for production use
6. **API Key Rotation**: Implement a key rotation strategy for API keys

## License

MIT
