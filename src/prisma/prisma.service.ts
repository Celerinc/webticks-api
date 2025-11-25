import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured');
    }

    // Create PostgreSQL pool and adapter factory for Prisma 7
    // Parse connection string and add SSL if needed
    const poolConfig: any = { connectionString: databaseUrl };
    
    // Add SSL mode for secure connections (required by some providers like Koyeb)
    if (databaseUrl.includes('koyeb') || databaseUrl.includes('ssl')) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }
    
    const pool = new Pool(poolConfig);
    const adapterFactory = new PrismaPg(pool);

    super({
      adapter: adapterFactory,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

