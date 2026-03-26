import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from 'src/entities/achievement.entity';
import { UserAchievement } from 'src/entities/user-achievement.entity';
import { User } from 'src/entities/user.entity';
import { AchievementService } from './achievement.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, UserAchievement, User]),
    UserModule,
  ],
  exports: [AchievementService],
  providers: [AchievementService],
  controllers: [],
})
export class AchievementModule {}
