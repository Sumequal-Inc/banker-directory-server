import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);
