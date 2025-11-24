import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Post()
  async createApiKey(@Body() createApiKeyDto: CreateApiKeyDto) {
    const result = await this.apiKeysService.createApiKey(createApiKeyDto.name);
    return {
      id: result.id,
      key: result.key,
      message: 'Store this key securely. It will not be shown again.',
    };
  }
}

