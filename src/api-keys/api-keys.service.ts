import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) { }

  async createApiKey(userId: string, type: 'backend' | 'public', name?: string): Promise<{ key: string; id: string }> {
    let keyHash: string | null = null;
    let publicKey: string | null = null;
    let rawKey: string;

    if (type === 'backend') {
      // Generate random 32-byte key and hash it
      rawKey = crypto.randomBytes(32).toString('hex');
      keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    } else {
      // Generate UUID for public key
      rawKey = crypto.randomUUID();
      publicKey = rawKey;
    }

    const apiKey = await this.prisma.apiKey.create({
      data: {
        keyHash,
        publicKey,
        type,
        userId,
        name: name || null,
      },
    });

    return {
      key: rawKey,
      id: apiKey.id,
    };
  }

  async validateApiKey(inputKey: string): Promise<boolean> {
    // 1. Check if it's a public key (exact match)
    const publicKeyRecord = await this.prisma.apiKey.findUnique({
      where: { publicKey: inputKey },
    });

    if (publicKeyRecord) {
      this.updateLastUsed(publicKeyRecord.id);
      return true;
    }

    // 2. Check if it's a backend key (hash match)
    const keyHash = crypto.createHash('sha256').update(inputKey).digest('hex');
    const backendKeyRecord = await this.prisma.apiKey.findFirst({
      where: { keyHash },
    });

    if (backendKeyRecord) {
      this.updateLastUsed(backendKeyRecord.id);
      return true;
    }

    return false;
  }

  async findAllByUserId(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        publicKey: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });
  }

  async deleteApiKey(id: string) {
    return this.prisma.apiKey.delete({
      where: { id },
    });
  }

  private updateLastUsed(id: string) {
    this.prisma.apiKey
      .update({
        where: { id },
        data: { lastUsedAt: new Date() },
      })
      .catch(err => {
        console.error('Failed to update API key lastUsedAt', err);
      });
  }
}
