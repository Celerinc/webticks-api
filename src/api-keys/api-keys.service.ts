import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(name?: string): Promise<{ key: string; id: string }> {
    const rawKey = crypto.randomBytes(32).toString('hex');
    
    const keyHash = await bcrypt.hash(rawKey, 10);
    
    const apiKey = await this.prisma.apiKey.create({
      data: {
        keyHash,
        name: name || null,
      },
    });
    
    // Return the raw key only once (this is the only time it's available)
    return {
      key: rawKey,
      id: apiKey.id,
    };
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    const apiKeys = await this.prisma.apiKey.findMany();
    
    for (const keyRecord of apiKeys) {
      const isValid = await bcrypt.compare(apiKey, keyRecord.keyHash);
      if (isValid) {
        // Update last used timestamp
        await this.prisma.apiKey.update({
          where: { id: keyRecord.id },
          data: { lastUsedAt: new Date() },
        });
        return true;
      }
    }
    
    return false;
  }
}

