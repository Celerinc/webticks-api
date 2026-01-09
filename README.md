# WebTicks API - Quick Start Guide

A NestJS backend for collecting analytics data.

## Get Started in 2 Minutes

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   *Required:* `DATABASE_URL` (MongoDB) and `JWT_SECRET`.

3. **Initialize Database**
   ```bash
   pnpm run seed
   ```
   *Creates superadmin (`admin@webticks.com` / `supersecret`) and a test app.*

4. **Run Server**
   ```bash
   pnpm run dev
   ```
   *API runs at `http://localhost:3002/api`*

## Core Integration

### Tracking Events
Send a POST request to `/api/track` with the `webticks-app-id` header.

**Header:** `webticks-app-id: 97069816-8b25-4640-833f-f17259208a42` (default seed ID)

**Body:**
```json
{
  "uid": "user_123",
  "sessionId": "session_456",
  "datetime": "2024-01-01T00:00:00Z",
  "events": [
    { "type": "pageview", "path": "/" }
  ]
}
```

### Admin Login
POST `/api/auth/login` with admin credentials to receive a JWT.

---
*For full details on authentication and event types, refer to the source code in `src/auth` and `src/track`.*

## Auth & Key Management

### User Authentication
| Action | Endpoint | Auth | Body |
|--------|----------|------|------|
| **Register** | `POST /api/auth/register` | *None* | `{ email, password }` |
| **User Login** | `POST /api/auth/user/login` | *None* | `{ email, password }` |
| **Admin Login** | `POST /api/auth/admin/login` | *None* | `{ email, password }` |

### Key Management
*Requires Bearer Token from Login*

- **Create Key**: `POST /api/keys`
  - Body: `{ "type": "backend" | "public", "name": "Key Name" }`
  - *Returns raw key once. Store securely!*
- **List My Keys**: `GET /api/keys`
