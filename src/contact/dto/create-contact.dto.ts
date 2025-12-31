// src/contact/dto/create-contact.dto.ts
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { ContactStatus } from '../schemas/contact.schema';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  company?: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
