import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { ApiKey, ApiKeySchema, Application, ApplicationSchema } from '../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiKey.name, schema: ApiKeySchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
  ],
  controllers: [KeysController],
  providers: [KeysService],
  exports: [KeysService],
})
export class KeysModule { }
