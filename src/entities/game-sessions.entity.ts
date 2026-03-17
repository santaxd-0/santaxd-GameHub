import { Status } from "src/enums/status.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Guild } from "./guild.entity";
import { SessionParticipant } from "./session-participant.entity";

@Entity("game-sessions")
export class GameSessions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("char")
    title: string;

    @Column("text")
    gameName: string;

    @Column("timestamp")
    scheduledAt: Date;

    @Column("int")
    maxPlayers: number;

    @Column("enum", {
        enum: Status,
        default: Status.SCHEDULED
    })
    status: Status;

    @Column()
    creatorId: number;

    @Column()
    guildId: number;

    @ManyToOne(() => User, (user) => user.gameSessionsCreated)
    @JoinColumn({name: "creatorId"})
    creator: User;

    @ManyToOne(() => Guild, (guild) => guild.gameSessions)
    @JoinColumn({name: "guildId"})
    guild: Guild;

    @OneToMany(() => SessionParticipant, (session) => session.session)
    sessionParticipants: SessionParticipant[];

    @CreateDateColumn()
    createdAt: Date;
}