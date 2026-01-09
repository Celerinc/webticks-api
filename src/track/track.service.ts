import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyticsBatchDto } from './dto/analytics-batch.dto';
import { AnalyticsEvent, AnalyticsEventDocument } from '../database/schemas';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(AnalyticsEvent.name)
    private analyticsEventModel: Model<AnalyticsEventDocument>,
  ) { }

  async ingestBatch(batch: AnalyticsBatchDto) {
    const datetime = new Date(batch.datetime);

    // Use insertMany for better performance
    const documents = batch.events.map((event) => ({
      uid: batch.uid || null,
      sessionId: batch.sessionId,
      datetime,
      eventType: event.type,
      eventData: event,
    }));

    const result = await this.analyticsEventModel.insertMany(documents);

    return {
      success: true,
      eventsProcessed: result.length,
    };
  }
}
