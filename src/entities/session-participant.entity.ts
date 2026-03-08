import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { GameSessions } from "./game-sessions.entity";
import { User } from "./user.entity";

@Entity()
export class SessionParticipant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionId: number;

    @Column()
    userId: number;

    @Column("int", {
        nullable: true
    })
    score: number;

    @Column("boolean", {
        default: false
    })
    isMVP: boolean;

    @Column("timestamp", {
        default: Date.now()
    })
    joinedAt: Date;

    @ManyToOne(() => GameSessions, (gameSession) => gameSession.sessionParticipants)
    session: GameSessions;

    @ManyToOne(() => User, (user) => user.gameSessionsJoined)
    user: User
}