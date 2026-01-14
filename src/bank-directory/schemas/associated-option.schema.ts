import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AssociatedOption extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const AssociatedOptionSchema =
  SchemaFactory.createForClass(AssociatedOption);
