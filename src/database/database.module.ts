import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const uri = configService.get<string>('DATABASE_URL');
                if (!uri) {
                    throw new Error('DATABASE_URL is not configured');
                }
                return { uri };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule { }
