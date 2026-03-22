import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from 'src/entities/guild.entity';
import { UserGuild } from 'src/entities/user-guild.entity';
import { Repository } from 'typeorm';
import { CreateGuildDto } from './dto/create-guild.dto';
import { GuildRoles } from 'src/enums/guild-roles.enum';

@Injectable()
export class GuildService {
  constructor(
    @InjectRepository(Guild)
    private guildRepository: Repository<Guild>,
    @InjectRepository(UserGuild)
    private userGuildRepository: Repository<UserGuild>,
  ) {}
  async create(userId: number, createGuildDto: CreateGuildDto) {
    const existing = await this.guildRepository.findOne({
      where: [{ name: createGuildDto.name }, { tag: createGuildDto.tag }],
    });

    if (existing) {
      throw new ConflictException('Guild with this name or tag already exists');
    }

    const createdGuild = this.guildRepository.create({ ...createGuildDto });

    await this.guildRepository.save(createdGuild);

    await this.userGuildRepository.save({
      guildId: createdGuild.id,
      userId: userId,
      role: GuildRoles.OWNER,
    });

    return createdGuild;
  }

  async findAll(isPublic?: boolean) {
    if (isPublic) {
      return this.guildRepository.findBy({ isPublic });
    }

    return this.guildRepository.find();
  }

  async findMyGuilds(userId: number) {
    return this.userGuildRepository.find({
      where: { userId },
      relations: ['guilds'],
    });
  }
}
