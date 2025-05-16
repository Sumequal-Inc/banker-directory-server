import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class createBankerProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  currentInstitutionName: string;  

  @IsOptional()
  @IsString()
  designation: string;  

  @IsOptional()
  @IsDateString()
  dateOfJoining: Date; 

  @IsOptional()
  @IsString()
  totalExperience: string; 

  @IsOptional()
  @IsString()
  contact: string; 

  @IsOptional()
  @IsString()
  email: string;  

  @IsOptional()
  @IsString()
  location: string; 

  @IsOptional()
  @IsString()
  profileImage?: string;  

  @IsOptional()
  previousExperience?: { 
    currentInstitutionName: string;
    role: string;
    startDate: Date;
    endDate: Date;
    description: string;
  }[];  
}