import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { GameSessions } from './game-sessions.entity';
import { User } from './user.entity';

@Entity('session-participant')
export class SessionParticipant {
  @PrimaryColumn()
  sessionId: number;

  @PrimaryColumn()
  userId: number;

  @Column('int', {
    nullable: true,
  })
  score: number;

  @Column('boolean', {
    default: false,
  })
  isMVP: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(
    () => GameSessions,
    (gameSession) => gameSession.sessionParticipants,
  )
  @JoinColumn({ name: 'sessionId' })
  session: GameSessions;

  @ManyToOne(() => User, (user) => user.gameSessionsJoined)
  @JoinColumn({ name: 'userId' })
  user: User;
}
