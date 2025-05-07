import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}