import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LenderDocument = Lender & Document;

@Schema({ timestamps: true })
export class Lender {
  @Prop({ required: true })
  lenderName: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  managerName: string;

  @Prop({ required: true })
  bankerName: string;

  @Prop({ required: true })
  email: string;

  
  @Prop()
  rmName: string;

  @Prop()
  rmContact: string;

  @Prop()
  asmName: string;

  @Prop()
  asmContact: string;

  @Prop()
  rsmName: string;

  @Prop()
  rsmContact: string;

  @Prop()
  zsmName: string;
}

export const LenderSchema = SchemaFactory.createForClass(Lender);
