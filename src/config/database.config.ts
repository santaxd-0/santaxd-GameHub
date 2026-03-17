import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Achievement } from "src/entities/achievement.entity";
import { GameSessions } from "src/entities/game-sessions.entity";
import { Guild } from "src/entities/guild.entity";
import { SessionParticipant } from "src/entities/session-participant.entity";
import { UserAchievement } from "src/entities/user-achievement.entity";
import { UserGuild } from "src/entities/user-guild.entity";
import { User } from "src/entities/user.entity";

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV == "production";

    return {
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "postgres",
        entities: [
            User,
            UserGuild,
            GameSessions,
            SessionParticipant,
            UserAchievement,
            Achievement,
            Guild
        ],
        synchronize: !isProduction,
        logging: !isProduction,
        autoLoadEntities: true
    };
};