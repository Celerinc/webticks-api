import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class ServerRequestEventDto {
  @IsEnum(['server_request'])
  type: 'server_request';

  @IsString()
  method: string;

  @IsString()
  path: string;

  @IsObject()
  @IsOptional()
  query?: Record<string, any>;

  @IsObject()
  @IsOptional()
  headers?: Record<string, any>;

  @IsString()
  requestId: string;

  @IsString()
  timestamp: string;
}

