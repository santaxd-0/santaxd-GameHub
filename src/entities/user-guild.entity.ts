import { GuildRoles } from 'src/enums/guild-roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Guild } from './guild.entity';

@Entity('user-guild')
export class UserGuild {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  guildId: number;

  @Column('enum', {
    enum: GuildRoles,
    default: GuildRoles.MEMBER,
  })
  role: GuildRoles;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => User, (user) => user.guildsJoined)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Guild, (guild) => guild.usersJoined)
  @JoinColumn({ name: 'guildId' })
  guild: Guild;
}
