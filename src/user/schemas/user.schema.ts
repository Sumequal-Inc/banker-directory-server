import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: false, enum: ['male', 'female', 'other'] })
  gender?: 'male' | 'female' | 'other';

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['admin', 'user', 'broker', 'brokeradmin'], default: 'user' })
  role: 'admin' | 'user' | 'broker' | 'brokeradmin';

  // ✅ Secure reset-link fields
  @Prop({ type: String, default: null })
  resetPasswordTokenHash?: string | null;

  @Prop({ type: Date, default: null })
  resetPasswordExpiry?: Date | null;

  @Prop({ type: Number, default: 0 })
  resetPasswordAttempts?: number;

  @Prop({ type: Date, default: null })
  resetPasswordLockedUntil?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
