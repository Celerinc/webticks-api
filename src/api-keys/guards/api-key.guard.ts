import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ApiKeysService } from '../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new ForbiddenException('API key is required');
    }

    try {
      const isValid = await this.apiKeysService.validateApiKey(apiKey);
      if (!isValid) {
        throw new ForbiddenException('Invalid API key');
      }
      return true;
    } catch (error) {
      // If database error, still reject (security: fail closed)
      throw new ForbiddenException('Invalid API key');
    }
  }
}

