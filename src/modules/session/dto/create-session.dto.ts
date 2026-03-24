import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateGameSessionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  gameName: string;

  @IsNotEmpty()
  @IsDate()
  scheduledAt?: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(100)
  maxPlayers?: number;

  @IsNotEmpty()
  @IsNumber()
  guildId: number;
}
