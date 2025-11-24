import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsBatchDto } from './dto/analytics-batch.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async ingestBatch(batch: AnalyticsBatchDto) {
    const datetime = new Date(batch.datetime);

    // Store each event in the database
    const events = await Promise.all(
      batch.events.map((event) =>
        this.prisma.analyticsEvent.create({
          data: {
            uid: batch.uid || null,
            sessionId: batch.sessionId,
            datetime,
            eventType: event.type,
            eventData: event as any,
          },
        }),
      ),
    );

    return {
      success: true,
      eventsProcessed: events.length,
    };
  }
}

