import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Directory extends Document {
  @Prop()
  bankName: string;

  @Prop()
  bankType: string;

  @Prop()
  address: string;

  @Prop()
  bicCode: string;

  @Prop()
  branchCode: string;

  @Prop()
  executive: string;

  @Prop()
  status: string;
}

export const DirectorySchema = SchemaFactory.createForClass(Directory);