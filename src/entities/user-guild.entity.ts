import { Role } from "src/enums/role.enum";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Guild } from "./guild.entity";

@Entity()
export class UserGuild {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    guildId: number;

    @Column("enum", {
        enum: Role,
        default: Role.MEMBER
    })
    role: Role;
    
    @Column("timestamp")
    joinedAt: Date;

    @ManyToOne(() => User, (user) => user.guildsJoined)
    user: User;

    @ManyToOne(() => Guild, (guild) => guild.usersJoined)
    guild: Guild;
}