import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { TrackService } from './track.service';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import { AnalyticsBatchDto } from './dto/analytics-batch.dto';

@Controller('track')
@UseGuards(ApiKeyGuard)
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  async track(@Body() batch: AnalyticsBatchDto) {
    return this.trackService.ingestBatch(batch);
  }
}

