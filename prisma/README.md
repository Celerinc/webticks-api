# Prisma Schema Files

This directory contains schema files for different database providers.

## Available Schemas

- **`schema.prisma`** - PostgreSQL schema (currently active)
- **`schema.mongodb.prisma`** - MongoDB schema (backup/alternative)

## Switching Between Databases

### To Switch to MongoDB:

1. **Backup current schema:**
   ```bash
   mv prisma/schema.prisma prisma/schema.postgresql.prisma
   ```

2. **Activate MongoDB schema:**
   ```bash
   mv prisma/schema.mongodb.prisma prisma/schema.prisma
   ```

3. **Update your `.env` file:**
   ```env
   # Change from PostgreSQL:
   # DATABASE_URL="postgresql://user:password@localhost:5432/webticks?schema=public"
   
   # To MongoDB:
   DATABASE_URL="mongodb://user:password@localhost:27017/webticks?authSource=admin"
   ```

4. **Regenerate Prisma Client:**
   ```bash
   pnpm run prisma:generate
   ```

5. **Push schema to database (MongoDB doesn't use traditional migrations):**
   ```bash
   pnpm prisma db push
   ```

### To Switch Back to PostgreSQL:

1. **Backup MongoDB schema:**
   ```bash
   mv prisma/schema.prisma prisma/schema.mongodb.prisma
   ```

2. **Activate PostgreSQL schema:**
   ```bash
   mv prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

3. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/webticks?schema=public"
   ```

4. **Regenerate Prisma Client:**
   ```bash
   pnpm run prisma:generate
   ```

5. **Run migrations:**
   ```bash
   pnpm run prisma:migrate
   ```

## Key Differences

### PostgreSQL (`schema.prisma`)
- Uses UUIDs for IDs: `@id @default(uuid())`
- Supports traditional migrations
- Uses `prisma migrate dev` for schema changes

### MongoDB (`schema.mongodb.prisma`)
- Uses ObjectId for IDs: `@id @default(auto()) @map("_id") @db.ObjectId`
- Uses `prisma db push` for schema changes (no migrations)
- Connection string format is different

## Notes

- Always regenerate Prisma Client after switching schemas
- Make sure your `.env` `DATABASE_URL` matches the active schema
- MongoDB doesn't support all PostgreSQL features (e.g., transactions work differently)

