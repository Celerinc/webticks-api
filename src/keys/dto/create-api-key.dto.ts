import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateApiKeyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsIn(['backend', 'public'])
  type: 'backend' | 'public';
}
