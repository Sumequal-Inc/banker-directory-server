import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Directory extends Document {
  @Prop()
  fullName: string;

  @Prop()
  currentInstitutionName: string; 

  @Prop()
  designation: string; 

  @Prop()
  dateOfJoining: Date; 
  @Prop()
  totalExperience: string; 

  @Prop()
  contact: string; 

  @Prop({ unique: true })
  email: string; 

  @Prop()
  location: string;  

  @Prop({ required: false })
  profileImage?: string;  

  
  @Prop([{ currentInstitutionName: String, role: String, startDate: Date, endDate: Date, description: String }])
  previousExperience: { currentInstitutionName: string, role: string, startDate: Date, endDate: Date, description: string }[];
}

export const DirectorySchema = SchemaFactory.createForClass(Directory);