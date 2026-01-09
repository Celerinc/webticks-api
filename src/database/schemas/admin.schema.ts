import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ collection: 'admins', timestamps: true })
export class Admin {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ default: false })
    isSuperAdmin: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
