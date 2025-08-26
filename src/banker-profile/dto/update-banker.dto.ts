// src/bankers/dto/update-banker.dto.ts
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateBankerProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() profileImage?: string;
  @IsOptional() @IsString() designation?: string;
  @IsOptional() @IsString() currentInstitutionName?: string;
  @IsOptional() @IsString() dateOfJoining?: string;
  @IsOptional() @IsString() totalExperience?: string;
  @IsOptional() @IsString() contact?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() bankName?: string;
}
