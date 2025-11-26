import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { KeysService } from '../keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private keysService: KeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new ForbiddenException('API key is required');
    }

    try {
      const isValid = await this.keysService.validateApiKey(apiKey);
      if (!isValid) {
        throw new ForbiddenException('Invalid API key');
      }
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid API key');
    }
  }
}
