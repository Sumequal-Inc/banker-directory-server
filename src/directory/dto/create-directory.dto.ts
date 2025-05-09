import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDirectoryDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  currentInstitutionName: string;  

  @IsNotEmpty()
  @IsString()
  designation: string;  

  @IsNotEmpty()
  @IsDateString()
  dateOfJoining: Date; 

  @IsNotEmpty()
  @IsString()
  totalExperience: string; 

  @IsNotEmpty()
  @IsString()
  contact: string; 

  @IsNotEmpty()
  @IsString()
  email: string;  

  @IsNotEmpty()
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