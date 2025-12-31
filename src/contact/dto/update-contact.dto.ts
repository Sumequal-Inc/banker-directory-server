// src/contact/dto/update-contact.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContactStatus } from '../schemas/contact.schema';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  internalNote?: string;
}
