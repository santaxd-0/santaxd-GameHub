import { Categories } from 'src/enums/category.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAchievement } from './user-achievement.entity';
import { AchievementCriteriaType } from 'src/enums/achievement-criteria-type.enum';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  icon: string;

  @Column('enum', {
    enum: Categories,
  })
  category: Categories;

  @Column('enum', {
    enum: AchievementCriteriaType,
  })
  criteriaType: AchievementCriteriaType;

  @Column()
  criteriaScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
  )
  usersGained: UserAchievement[];
}
