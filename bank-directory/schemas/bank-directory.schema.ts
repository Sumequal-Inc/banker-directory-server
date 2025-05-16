import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BankerDirectory extends Document {
  @Prop({ required: true })
  bankerName: string;

  @Prop({ required: true })
  associatedWith: string;

  @Prop({ type: [String], required: true })
  locationCategories: string[];

  @Prop({ required: true, unique: true })
  emailOfficial: string;

  @Prop({ required: false })
  emailPersonal?: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  product: string;
}

export const BankerDirectorySchema = SchemaFactory.createForClass(BankerDirectory);
