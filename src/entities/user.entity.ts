import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameSessions } from "./game-sessions.entity";
import { UserGuild } from "./user-guild.entity";
import { SessionParticipant } from "./session-participant.entity";
import { UserAchievement } from "./user-achievement.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column("text")
    email: string;

    @Column()
    password: string;

    @Column("varchar", {length: 20, nullable: true})
    gamertag: string;

    @Column("text", {
        default: null,
        nullable: true
    })
    avatar: string;

    @Column("int", {
        default: 0
    })
    level: number;

    @Column("int", {
        default: 1
    })
    totalScore: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => GameSessions, (session) => session.creator)
    gameSessionsCreated: GameSessions[];

    @OneToMany(() => UserGuild, (userGuild) => userGuild.user)
    guildsJoined: UserGuild[];

    @OneToMany(() => SessionParticipant, (session) => session.user)
    gameSessionsJoined: SessionParticipant[];

    @OneToMany(() => UserAchievement, (achievement) => achievement.user)
    achievements: UserAchievement[];
}