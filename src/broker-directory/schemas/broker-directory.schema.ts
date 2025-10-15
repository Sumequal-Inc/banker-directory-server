import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrokerDirectoryDocument = HydratedDocument<BrokerDirectory>;

class Location {
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  pincode?: string;
}

@Schema({ timestamps: true })
export class BrokerDirectory {
  @Prop({ type: String, required: true })
  brokerName!: string;

  @Prop({ type: String })
  agencyName?: string;

  @Prop({ type: [String], default: [] })
  specialization?: string[];

  @Prop({ type: [String], default: [] })
  serviceProjectNames?: string[];

  @Prop({ type: Object })
  location?: Location;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({ type: String })
  linkedinProfile?: string;

  @Prop({ type: String })
  whatsappNumber?: string;

  @Prop({ type: Number })
  experienceYears?: number;

  @Prop({ type: String })
  website?: string;

  @Prop({ type: Number, min: 0, max: 5 })
  rating?: number;

  @Prop({ type: Boolean, default: false })
  isVerified?: boolean;

  @Prop({ type: Number, min: 0, max: 5 })
  avgRating?: number;

  @Prop({ type: String })
  facebookProfile?: string;
}

export const BrokerDirectorySchema = SchemaFactory.createForClass(BrokerDirectory);
