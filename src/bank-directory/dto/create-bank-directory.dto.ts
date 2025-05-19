import { IsOptional, IsString, IsArray, IsEmail } from 'class-validator';

export class CreateBankerDirectoryDto {
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
  @IsString()
  emailOfficial?: string;

  @IsOptional()
  @IsString()
  emailPersonal?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  product?: string[];
}
