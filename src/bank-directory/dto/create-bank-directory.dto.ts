import { IsOptional, IsString, IsArray } from 'class-validator';

export class CreateBankerDirectoryDto {
  @IsOptional()
  @IsString()
  bankerName?: string;

  @IsOptional()
  @IsString()
  associatedWith?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

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
