import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaModule } from '../prisma/prisma.module';
import { KeysModule } from '../keys/keys.module';

@Module({
  imports: [PrismaModule, KeysModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule { }
