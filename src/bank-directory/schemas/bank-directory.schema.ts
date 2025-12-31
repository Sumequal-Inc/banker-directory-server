import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BankerDirectory extends Document {
  @Prop({ required: false })
  bankerName?: string;

  @Prop({ required: false })
  associatedWith?: string;

  @Prop({ type: [String], required: false })
  state?: string[];
  
  @Prop({ type: [String], required: false })
  city?: string[];

  @Prop({ required: false })
  emailOfficial?: string;

  @Prop({ required: false })
  emailPersonal?: string;

  @Prop({ required: false })
  contact?: string;

  @Prop({ type: [String], required: false })
  product?: string[];

  @Prop({ required: false })
  lastCurrentDesignation?: string;
}

export const BankerDirectorySchema = SchemaFactory.createForClass(BankerDirectory);
