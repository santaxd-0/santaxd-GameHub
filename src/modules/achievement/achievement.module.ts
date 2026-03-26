import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { UserAchievement } from 'src/entities/user-achievement.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, UserAchievement, User])],
  exports: [],
  providers: [],
  controllers: [],
})
export class AchievementModule {}
