import { IsString, IsArray, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { PageViewEventDto } from './page-view-event.dto';
import { CustomEventDto } from './custom-event.dto';
import { ServerRequestEventDto } from './server-request-event.dto';
import { IsValidEvent } from './event-validator';

export type AnalyticsEventUnion = PageViewEventDto | CustomEventDto | ServerRequestEventDto;

export class AnalyticsBatchDto {
  @IsString()
  @IsOptional()
  uid?: string;

  @IsString()
  sessionId: string;

  @IsString()
  datetime: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsValidEvent({ each: true })
  events: AnalyticsEventUnion[];
}

