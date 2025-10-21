import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({
    required: false,
    enum: ['male', 'female', 'other'],
  })
  gender?: 'male' | 'female' | 'other';
  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['admin', 'user', 'broker', 'brokeradmin'], default: 'user' })
  role: 'admin' | 'user' | 'broker' | 'brokeradmin';

 
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
