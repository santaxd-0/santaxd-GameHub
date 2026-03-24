import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild } from 'src/entities/guild.entity';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { AuthModule } from '../auth/auth.module';
import { UserGuild } from 'src/entities/user-guild.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guild, UserGuild]), AuthModule],
  providers: [GuildService],
  controllers: [GuildController],
  exports: [GuildService],
})
export class GuildModule {}
