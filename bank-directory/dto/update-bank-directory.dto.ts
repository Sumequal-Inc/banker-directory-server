import { IsOptional, IsString, IsArray, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateBankerDirectoryDto {
  @IsOptional()
  @IsString()
  bankerName?: string;

  @IsOptional()
  @IsString()
  associatedWith?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locationCategories?: string[];

  @IsOptional()
  @IsEmail()
  emailOfficial?: string;

  @IsOptional()
  @IsEmail()
  emailPersonal?: string;

  @IsOptional()
  @IsPhoneNumber()
  contact?: string;

  @IsOptional()
  @IsString()
  product?: string;
}
