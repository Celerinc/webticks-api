import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsBatchDto } from './dto/analytics-batch.dto';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) { }

  async ingestBatch(batch: AnalyticsBatchDto) {
    const datetime = new Date(batch.datetime);

    // Use createMany for better performance
    const result = await this.prisma.analyticsEvent.createMany({
      data: batch.events.map((event) => ({
        uid: batch.uid || null,
        sessionId: batch.sessionId,
        datetime,
        eventType: event.type,
        eventData: event as any, // Prisma Json type compatibility
      })),
    });

    return {
      success: true,
      eventsProcessed: result.count,
    };
  }
}

