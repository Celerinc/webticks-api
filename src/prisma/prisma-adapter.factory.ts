import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';

const SSL_FLAGS = ['sslmode=require', 'sslmode=verify-full', 'ssl=true'];

export function createPostgresAdapter(databaseUrl: string): PrismaPg {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const poolConfig: PoolConfig = {
    connectionString: databaseUrl,
  };

  const normalizedUrl = databaseUrl.toLowerCase();
  if (SSL_FLAGS.some((flag) => normalizedUrl.includes(flag))) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);
  return new PrismaPg(pool);
}

