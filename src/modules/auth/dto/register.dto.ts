import { IsEmail, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsOptional()
    gamertag?: string;
}