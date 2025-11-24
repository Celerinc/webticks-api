import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CustomEventDto {
  @IsEnum(['custom'])
  type: 'custom';

  @IsString()
  name: string;

  @IsObject()
  details: Record<string, any>;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  requestId: string;

  @IsString()
  timestamp: string;
}

