import { Controller, Post, Get, Delete, UseGuards, Request, Body, Param, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) { }

  // User endpoints
  @Post()
  async createApiKey(@Request() req, @Body() createApiKeyDto: CreateApiKeyDto) {
    if (req.user.role !== 'user') {
      throw new UnauthorizedException('Only users can create keys via this endpoint');
    }
    const result = await this.apiKeysService.createApiKey(
      req.user.id,
      createApiKeyDto.type,
      createApiKeyDto.name,
    );
    return {
      id: result.id,
      key: result.key,
      message: 'Store this key securely. It will not be shown again.',
    };
  }

  @Get()
  async listKeys(@Request() req) {
    if (req.user.role !== 'user') {
      throw new UnauthorizedException('Only users can list keys via this endpoint');
    }
    return this.apiKeysService.findAllByUserId(req.user.id);
  }

  // Admin endpoints
  @Post('admin/keys')
  async createApiKeyForUser(@Request() req, @Body() body: { userId: string; type: 'backend' | 'public'; name?: string }) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can create keys for users');
    }
    const result = await this.apiKeysService.createApiKey(body.userId, body.type, body.name);
    return {
      id: result.id,
      key: result.key,
      message: 'Store this key securely. It will not be shown again.',
    };
  }

  @Delete('admin/keys/:id')
  async deleteApiKey(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete keys');
    }
    return this.apiKeysService.deleteApiKey(id);
  }
}
