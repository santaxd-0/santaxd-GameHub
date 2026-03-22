import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGuildDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(5)
  @IsUppercase()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  maxMembers: number;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
