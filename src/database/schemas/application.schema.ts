import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ collection: 'applications', timestamps: true })
export class Application {
    @Prop({ required: true, unique: true })
    appId: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    domain?: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
