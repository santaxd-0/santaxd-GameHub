import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSessions } from 'src/entities/game-sessions.entity';
import { AuthModule } from '../auth/auth.module';
import { GameSessionsService } from './services/session.service';
import { GameSessionsController } from './session.controller';
import { GuildModule } from '../guild/guild.module';
import { SessionParticipant } from 'src/entities/session-participant.entity';
import { StatsService } from './services/stats.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameSessions, SessionParticipant, User]),
    AuthModule,
    GuildModule,
  ],
  exports: [GameSessionsService, StatsService],
  providers: [GameSessionsService, StatsService],
  controllers: [GameSessionsController],
})
export class SessionModule {}
