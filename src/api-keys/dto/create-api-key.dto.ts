import { IsString, IsOptional } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsOptional()
  name?: string;
}

