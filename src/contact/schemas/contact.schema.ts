
// src/contact/schemas/contact.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

export enum ContactStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived'
}

@Schema({ timestamps: true, collection: 'contacts' })
export class Contact {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  company?: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ trim: true })
  source?: string; // e.g. "landing_contact_section"

  @Prop({
    type: String,
    enum: ContactStatus,
    default: ContactStatus.NEW
  })
  status: ContactStatus;

  @Prop({ trim: true })
  internalNote?: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
