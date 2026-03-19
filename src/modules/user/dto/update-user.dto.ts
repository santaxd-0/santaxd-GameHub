import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    gamertag?: string;

    @IsString()
    @IsOptional()
    avatar?: string;
}