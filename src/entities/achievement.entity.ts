import { Categories } from "src/enums/category.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAchievement } from "./user-achievement.entity";

@Entity("achievements")
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("string")
    name: string;

    @Column("string")
    description: string;

    @Column("url")
    icon: string;

    @Column("enum", {
        enum: Categories
    })
    category: Categories;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
    usersGained: UserAchievement[];
}