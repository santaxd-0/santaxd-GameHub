import { InjectRepository } from '@nestjs/typeorm';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GameSessionsService } from './session.service';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from 'src/entities/user.entity';

export class StatsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(GameSessionsService)
    private gameSessionsService: GameSessionsService,
  ) {}

  @OnEvent('session.completed')
  async handleSessionCompleteds(payload: { sessionId: number }) {
    const gameSession = await this.gameSessionsService.findOne(
      payload.sessionId,
    );
    const sessionParticipants = gameSession.sessionParticipants;
    await this.userRepository.manager.transaction(async (manager) => {
      for (const participant of sessionParticipants) {
        const userUpdateTotalScore =
          participant.score + participant.user.totalScore;

        const newLevel = Math.floor(userUpdateTotalScore / 1000) + 1;

        await manager.update(
          User,
          { id: participant.userId },
          { totalScore: userUpdateTotalScore, level: newLevel },
        );
      }
    });
  }
}
