// src/bank-directory/schemas/banker_directory_review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type BankerDirectoryReviewDocument = BankerDirectoryReview & Document;

@Schema({ timestamps: true })
export class BankerDirectoryReview {
  @Prop()
  bankerName?: string;

  @Prop()
  associatedWith?: string;

  @Prop()
  state?: string;

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

  @Prop({ type: [String], default: [] })
  product?: string[];

  @Prop({ type: String, default: 'pending' })
  status?: 'pending' | 'approved' | 'rejected';

  @Prop({ type: String, default: null })
  rejectionReason?: string | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: String, default: null })
  createdByName?: string;

  @Prop({ type: String, default: null })
  createdByEmail?: string;
}

export const BankerDirectoryReviewSchema =
  SchemaFactory.createForClass(BankerDirectoryReview);
