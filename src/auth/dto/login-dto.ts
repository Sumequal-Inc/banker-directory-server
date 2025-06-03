import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {

  // @IsNotEmpty()
  // @IsString()
  // readonly fullName: string;

    
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}