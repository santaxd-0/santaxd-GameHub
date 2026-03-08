import { Categories } from "src/enums/category.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAchievement } from "./user-achievement.entity";

@Entity()
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

    @Column("timestamp")
    createdAt: Date;

    @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.achievement)
    usersGained: UserAchievement[];
}