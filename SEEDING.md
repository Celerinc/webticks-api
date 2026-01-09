# WebTicks API - Database Seeding

## Quick Start

To seed the database with test data:

```bash
pnpm run seed
```

## What Gets Created

The seed script creates:

1. **Superadmin Account**
   - Email: `admin@webticks.com`
   - Password: `supersecret`
   - Used for admin operations

2. **Test User Account**
   - Email: `user@webticks.com`
   - Password: `testpassword`
   - Used for creating API keys and applications

3. **Frontend Example Application**
   - Name: `Frontend Example App`
   - Domain: `localhost:3000`
   - **App ID**: Generated UUID (displayed in console output)

## Using the App ID

After running the seed script, copy the App ID from the console output and use it in your frontend application by adding it as a header:

```javascript
fetch('http://localhost:3000/api/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'webticks-app-id': 'YOUR-APP-ID-HERE'
  },
  body: JSON.stringify({
    // your tracking data
  })
});
```

## Re-running the Seed

The seed script is idempotent - it will skip creating records that already exist. If you need to start fresh, drop the database collections first:

```bash
# Using MongoDB shell
mongosh mongodb://localhost:27017/webticks
db.admins.drop()
db.users.drop()
db.applications.drop()
```
