import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { KeysModule } from '../keys/keys.module';
import { AnalyticsEvent, AnalyticsEventSchema } from '../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalyticsEvent.name, schema: AnalyticsEventSchema },
    ]),
    KeysModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule { }
