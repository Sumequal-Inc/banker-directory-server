import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankerDirectoryReviewDocument = BankerDirectoryReview & Document;

@Schema({ timestamps: true })
export class BankerDirectoryReview {
  @Prop({ required: true }) bankerName: string;

  @Prop({ required: true }) associatedWith: string;

  @Prop({ type: [String] }) locationCategories: string[];

  @Prop() emailOfficial?: string;

  @Prop() emailPersonal?: string;

  @Prop() contact: string;

  @Prop() lastCurrentDesignation: string;

  @Prop({ type: [String] }) product: string[];

  @Prop({ default: 'pending' }) status: 'pending' | 'approved' | 'rejected';

  @Prop({ default: null }) rejectionReason?: string; 
}

export const BankerDirectoryReviewSchema = SchemaFactory.createForClass(BankerDirectoryReview);
