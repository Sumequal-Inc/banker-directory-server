import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectoryDto {
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  bankType: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  bicCode: string;

  @IsNotEmpty()
  @IsString()
  branchCode: string;

  @IsNotEmpty()
  @IsString()
  executive: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}