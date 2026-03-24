import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSessions } from 'src/entities/game-sessions.entity';
import { AuthModule } from '../auth/auth.module';
import { GameSessionsService } from './session.service';
import { GameSessionsController } from './session.controller';
import { GuildModule } from '../guild/guild.module';
import { SessionParticipant } from 'src/entities/session-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameSessions, SessionParticipant]),
    AuthModule,
    GuildModule,
  ],
  exports: [GameSessionsService],
  providers: [GameSessionsService],
  controllers: [GameSessionsController],
})
export class SessionModule {}
