import { IsEnum, IsNotEmpty } from 'class-validator';
import { GuildRoles } from 'src/enums/guild-roles.enum';

export class UpdateMemberRoleDto {
  @IsNotEmpty()
  @IsEnum(GuildRoles)
  role: GuildRoles;
}
