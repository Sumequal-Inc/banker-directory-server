import { IsNotEmpty, IsString, IsOptional, IsArray, IsPhoneNumber, IsEmail } from 'class-validator';

export class CreateBankerDirectoryDto {
  @IsNotEmpty()
  @IsString()
  bankerName: string;

  @IsNotEmpty()
  @IsString()
  associatedWith: string;

  @IsArray()
  @IsString({ each: true })
  locationCategories: string[];

  @IsNotEmpty()
  @IsEmail()
  emailOfficial: string;

  @IsOptional()
  @IsEmail()
  emailPersonal?: string;

  @IsPhoneNumber()
  contact: string;

  @IsNotEmpty()
  @IsString()
  product: string;
}
