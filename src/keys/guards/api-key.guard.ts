import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { KeysService } from '../keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private keysService: KeysService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Debug logging
    this.logger.debug('=== Incoming Request ===');
    this.logger.debug(`Headers: ${JSON.stringify(request.headers, null, 2)}`);

    const appId = request.headers['webticks-app-id'];
    this.logger.debug(`Extracted webticks-app-id: ${appId || 'NOT FOUND'}`);

    if (!appId) {
      this.logger.warn('webticks-app-id header is required but not provided');
      throw new ForbiddenException('webticks-app-id header is required');
    }

    try {
      const isValid = await this.keysService.validateAppId(appId);
      this.logger.debug(`App ID validation result: ${isValid}`);
      if (!isValid) {
        this.logger.warn('Invalid app ID provided');
        throw new ForbiddenException('Invalid app ID');
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`App ID validation error: ${error.message}`);
      throw new ForbiddenException('Invalid app ID');
    }
  }
}
