import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Status } from "src/enums/status.enum";

export class SessionFilterDto {
  @IsOptional()
  @IsNumber()
  guildId?: number;
  
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
  
  @IsOptional()
  @IsString()
  gameName?: string;
}