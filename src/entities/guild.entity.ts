import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameSessions } from "./game-sessions.entity";
import { UserGuild } from "./user-guild.entity";

@Entity("guilds")
export class Guild {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("string")
    name: string;

    @Column("char", {length: 5, unique: true})
    tag: string;

    @Column("string")
    description: string;

    @Column("int", {default: 50})
    maxMembers: number;

    @Column("boolean", {default: true})
    isPublic: boolean;

    @OneToMany(() => GameSessions, (session) => session.guild)
    gameSessions: GameSessions[];

    @OneToMany(() => UserGuild, (userGuild) => userGuild.guild)
    usersJoined: UserGuild[];

    @CreateDateColumn()
    createdAt: Date;
}