import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true, 
})
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

  // ✅ IMPORTANT: createdBy should be ObjectId (same as review createdBy)
  @Prop({ type: Types.ObjectId, ref: 'User', required: false, index: true })
  createdBy?: Types.ObjectId;

  @Prop({ required: false, index: true })
  createdByName?: string;

  @Prop({ required: false, index: true })
  createdByEmail?: string;
}

export const BankerDirectorySchema = SchemaFactory.createForClass(BankerDirectory);

/* ✅ Indexes (huge data performance) */
BankerDirectorySchema.index({ createdBy: 1, createdAt: -1 });
BankerDirectorySchema.index({ createdByEmail: 1 });
BankerDirectorySchema.index({ createdByName: 1 });
