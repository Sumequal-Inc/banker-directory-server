import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLenderDto {
  @IsNotEmpty()
  @IsString()
 lenderName: string;
 
  @IsOptional()
  @IsString()
  location: string;


 
}