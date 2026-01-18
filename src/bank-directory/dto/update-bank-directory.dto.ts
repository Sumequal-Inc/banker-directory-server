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
state?: string[];

@IsOptional()
@IsArray()
@IsString({ each: true })
city?: string[];


  @IsOptional()
  @IsString()
  emailOfficial?: string;

  @IsOptional()
  @IsString()
  emailPersonal?: string;

  @IsOptional()
  contact?: string;

@IsOptional()
@IsArray()
@IsString({ each: true })
product?: string[];

}