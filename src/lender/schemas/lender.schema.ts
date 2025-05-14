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
  @Prop({required:true})
  email:string;
}
export const LenderSchema = SchemaFactory.createForClass(Lender);






