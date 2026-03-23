import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { GuildRoles } from 'src/enums/guild-roles.enum';

export class AddMemberDto {
  @IsInt()
  @IsNotEmpty()
  targetUserId: number;

  @IsEnum(GuildRoles)
  @IsOptional()
  role?: GuildRoles;
}
