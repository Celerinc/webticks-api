import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(name?: string): Promise<{ key: string; id: string }> {
    // 1. Generate a random 32-byte key (64 hex characters)
    const rawKey = crypto.randomBytes(32).toString('hex');
    
    // 2. Create a deterministic SHA-256 hash of the key
    // This allows us to re-create this hash later for direct lookup
    const keyHash = crypto
      .createHash('sha256')
      .update(rawKey)
      .digest('hex');
    
    // 3. Store the hash directly
    const apiKey = await this.prisma.apiKey.create({
      data: {
        keyHash,
        name: name || null,
      },
    });
    
    return {
      key: rawKey,
      id: apiKey.id,
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    // 1. Hash the incoming key using the same algorithm
    const keyHash = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    // 2. Direct O(1) database lookup using the unique keyHash
    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { keyHash },
    });

    if (keyRecord) {
      // 3. Async update of usage stats (fire-and-forget to avoid latency)
      this.prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
      }).catch(err => {
        // Log error but don't fail the request
        console.error('Failed to update API key lastUsedAt', err);
      });

      return true;
    }
    
    return false;
  }
}