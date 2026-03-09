import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Achievement } from "./achievement.entity";

@Entity("user-achievement")
export class UserAchievement {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    achievementId: number;

    @CreateDateColumn()
    earnedAt: Date;

    @ManyToOne(() => User, (user) => user.achievements)
    @JoinColumn({name: "userId"})
    user: User;

    @ManyToOne(() => Achievement, (achievement) => achievement.usersGained)
    @JoinColumn({name: "achievementId"})
    achievement: Achievement;
}