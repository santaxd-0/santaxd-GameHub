import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { UserAchievement } from 'src/entities/user-achievement.entity';
import { In, Not, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    @Inject(UserService)
    private userService: UserService,
  ) {}

  @OnEvent('user.stats.updated')
  async giveAchievement(payload: { userId: number }) {
    const userStats = await this.userService.showStats(payload.userId);

    if (!userStats) {
      throw new ConflictException('Can`t fetch user stats!');
    }

    const gainedAchievements = await this.userAchievementRepository.findBy({
      userId: payload.userId,
    });

    const gainedIds = gainedAchievements.map((ach) => ach.achievementId);

    let notGainedAchievements: Achievement[] = [];

    if (gainedIds.length > 0) {
      notGainedAchievements = await this.achievementRepository.findBy({
        id: Not(In(gainedIds)),
      });
    } else if (gainedIds.length === 0) {
      notGainedAchievements = await this.achievementRepository.find();
    }

    for (const achievement of notGainedAchievements) {
      if (userStats.totalScore >= achievement.criteriaScore) {
        await this.userAchievementRepository.insert({
          userId: payload.userId,
          achievementId: achievement.id,
        });
      }
    }
  }
}
