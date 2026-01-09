import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { ApiKey, ApiKeyDocument } from '../database/schemas';

@Injectable()
export class KeysService {
  constructor(
    @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>,
  ) { }

  async createApiKey(
    userId: string,
    type: 'backend' | 'public',
    name?: string,
  ): Promise<{ key: string; id: string }> {
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

    const apiKey = await this.apiKeyModel.create({
      keyHash,
      publicKey,
      type,
      userId,
      name: name || null,
    });

    return {
      key: rawKey,
      id: apiKey._id.toString(),
    };
  }

  async validateApiKey(inputKey: string): Promise<boolean> {
    // 1. Check if it's a public key (exact match)
    const publicKeyRecord = await this.apiKeyModel
      .findOne({ publicKey: inputKey })
      .exec();

    if (publicKeyRecord) {
      this.updateLastUsed(publicKeyRecord._id.toString());
      return true;
    }

    // 2. Check if it's a backend key (hash match)
    const keyHash = crypto.createHash('sha256').update(inputKey).digest('hex');
    const backendKeyRecord = await this.apiKeyModel
      .findOne({ keyHash })
      .exec();

    if (backendKeyRecord) {
      this.updateLastUsed(backendKeyRecord._id.toString());
      return true;
    }

    return false;
  }

  async findAllByUserId(userId: string) {
    const keys = await this.apiKeyModel
      .find({ userId })
      .select('name type publicKey createdAt lastUsedAt')
      .exec();

    return keys.map((key) => ({
      id: key._id.toString(),
      name: key.name,
      type: key.type,
      publicKey: key.publicKey,
      createdAt: key.createdAt,
      lastUsedAt: key.lastUsedAt,
    }));
  }

  async deleteApiKey(id: string) {
    return this.apiKeyModel.findByIdAndDelete(id).exec();
  }

  private updateLastUsed(id: string) {
    this.apiKeyModel
      .findByIdAndUpdate(id, { lastUsedAt: new Date() })
      .exec()
      .catch((err) => {
        console.error('Failed to update API key lastUsedAt', err);
      });
  }
}
