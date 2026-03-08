import { Status } from "src/enums/status.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Guild } from "./guild.entity";
import { SessionParticipant } from "./session-participant.entity";

@Entity()
export class GameSessions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("string")
    title: string;

    @Column("string")
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

    @ManyToOne(() => User, (user) => user.gameSessionsCreated)
    creatorId: User;

    @ManyToOne(() => Guild, (guild) => guild.gameSessions)
    guildId: Guild;

    @OneToMany(() => SessionParticipant, (session) => session.session)
    sessionParticipants: SessionParticipant[];

    @Column("timestamp", {
        default: Date.now()
    })
    createdAt: Date;
}