import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Achievement } from "./achievement.entity";

@Entity()
export class UserAchievement {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    achievementId: number;

    @Column("timestamp")
    earnedAt: Date;

    @ManyToOne(() => User, (user) => user.achievements)
    user: User;

    @ManyToOne(() => Achievement, (achievement) => achievement.usersGained)
    achievement: Achievement;
}