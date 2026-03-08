import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameSessions } from "./game-sessions.entity";
import { UserGuild } from "./user-guild.entity";

@Entity()
export class Guild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("string")
    name: string;

    @Column("char", {length: 4})
    tag: string;

    @Column("string")
    description: string;

    @Column("int", {default: 50})
    maxMembers: number;

    @Column("bool")
    isPublic: boolean;

    @OneToMany(() => GameSessions, (session) => session.guildId)
    gameSessions: GameSessions[];

    @OneToMany(() => UserGuild, (userGuild) => userGuild.guild)
    usersJoined: UserGuild[];

    @Column("timestamp")
    createdAt: Date;
}