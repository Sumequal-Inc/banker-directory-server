import {
  IsOptional, IsString, IsEmail, IsNumber, IsArray, IsBoolean, Min, Max,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class LocationDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() pincode?: string;
}

const toNum = (v: any) => {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};
const toBool = (v: any) => {
  if (typeof v === 'boolean') return v;
  if (v == null) return undefined;
  const s = String(v).toLowerCase();
  if (['true','yes','1'].includes(s)) return true;
  if (['false','no','0'].includes(s)) return false;
  return undefined;
};

export class CreateBrokerDirectoryDto {
  // REQUIRED by schema; fallback to fullName if client sends that
  @IsString()
  @Transform(({ value, obj }) => (value ?? obj?.fullName)?.toString().trim())
  brokerName!: string;

  // optional: accept fullName for backward-compat (ignored in DB)
  @IsOptional() @IsString()
  fullName?: string;

  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() agencyName?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  specialization?: string[];

  @IsOptional() @ValidateNested() @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional() @IsArray() @IsString({ each: true })
  serviceProjectNames?: string[];

  @IsOptional() @IsNumber() @Transform(({ value }) => toNum(value)) @Min(0) @Max(5)
  rating?: number;

  @IsOptional() @IsBoolean() @Transform(({ value }) => toBool(value))
  isVerified?: boolean;

  @IsOptional() @IsNumber() @Transform(({ value }) => toNum(value)) @Min(0) @Max(5)
  avgRating?: number;

  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() linkedinProfile?: string;
  @IsOptional() @IsString() whatsappNumber?: string;
  @IsOptional() @IsString() facebookProfile?: string;

  @IsOptional() @IsNumber() @Transform(({ value }) => toNum(value))
  experienceYears?: number;
}
