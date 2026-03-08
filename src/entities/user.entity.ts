import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameSessions } from "./game-sessions.entity";
import { UserGuild } from "./user-guild.entity";
import { SessionParticipant } from "./session-participant.entity";
import { UserAchievement } from "./user-achievement.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("string")
    username: string;

    @Column("string")
    email: string;

    @Column("varchar", {length: 16})
    password: string;

    @Column("varchar", {length: 5})
    gametag: string;

    @Column("string")
    avatar: string;

    @Column("int")
    level: number;

    @Column("int")
    totalScore: number;

    @Column("timestamp")
    createdAt: Date;

    @OneToMany(() => GameSessions, (session) => session.creatorId)
    gameSessionsCreated: GameSessions[];

    @OneToMany(() => UserGuild, (userGuild) => userGuild.user)
    guildsJoined: UserGuild[];

    @OneToMany(() => SessionParticipant, (session) => session.user)
    gameSessionsJoined: SessionParticipant[];

    @OneToMany(() => UserAchievement, (achievement) => achievement.user)
    achievements: UserAchievement[];
}