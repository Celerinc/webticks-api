import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AnalyticsEventDocument = HydratedDocument<AnalyticsEvent>;

@Schema({ collection: 'analytics_events', timestamps: { createdAt: true, updatedAt: false } })
export class AnalyticsEvent {
    @Prop({ index: true })
    uid?: string;

    @Prop({ required: true, index: true })
    sessionId: string;

    @Prop({ required: true, index: true })
    datetime: Date;

    @Prop({ required: true })
    eventType: string;

    @Prop({ type: MongooseSchema.Types.Mixed, required: true })
    eventData: Record<string, any>;

    createdAt: Date;
}

export const AnalyticsEventSchema = SchemaFactory.createForClass(AnalyticsEvent);
