import { IsString, IsEnum } from 'class-validator';

export class PageViewEventDto {
  @IsEnum(['pageview'])
  type: 'pageview';

  @IsString()
  path: string;

  @IsString()
  requestId: string;

  @IsString()
  timestamp: string;
}

