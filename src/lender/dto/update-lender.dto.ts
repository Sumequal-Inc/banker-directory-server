import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateLenderDto {
  @IsOptional()
  @IsString()
  lenderName: string;
 
  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  managerName: string;

}