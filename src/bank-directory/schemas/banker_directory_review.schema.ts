import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankerDirectoryReviewDocument = BankerDirectoryReview & Document;

@Schema({ timestamps: true })
export class BankerDirectoryReview {
  @Prop()
  bankerName?: string;

  @Prop()
  associatedWith?: string;

  // ✅ frontend se string aa rahi hai (e.g. "Delhi, Uttar Pradesh")
  @Prop()
  state?: string;

  // ✅ frontend se string aa rahi hai (e.g. "Noida, Ghaziabad")
  @Prop()
  city?: string;

  @Prop()
  emailOfficial?: string;

  @Prop()
  emailPersonal?: string;

  @Prop()
  contact?: string;

  @Prop()
 lastCurrentDesignation?: string;

  // ✅ array of strings
  @Prop({ type: [String], default: [] })
  product?: string[];

  @Prop({ type: String, default: 'pending' })
  status?: 'pending' | 'approved' | 'rejected';

  @Prop({ type: String, default: null })
  rejectionReason?: string | null;
}

export const BankerDirectoryReviewSchema =
  SchemaFactory.createForClass(BankerDirectoryReview);
