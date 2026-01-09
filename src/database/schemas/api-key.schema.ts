import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({ collection: 'api_keys', timestamps: true })
export class ApiKey {
    @Prop()
    keyHash?: string;

    @Prop({ unique: true, sparse: true })
    publicKey?: string;

    @Prop({ required: true, enum: ['backend', 'public'] })
    type: string;

    @Prop()
    name?: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop()
    lastUsedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
