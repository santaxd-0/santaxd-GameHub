import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSessions } from 'src/entities/game-sessions.entity';
import { Repository } from 'typeorm';
import { CreateGameSessionDto } from './dto/create-session.dto';
import { GuildService } from '../guild/guild.service';
import { Status } from 'src/enums/status.enum';
import { SessionFilterDto } from './dto/session-filter.dto';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectRepository(GameSessions)
    private gameSessionsRepository: Repository<GameSessions>,
    @Inject(GuildService)
    private guildService: GuildService,
  ) {}

  async create(userId: number, createGameSessionDto: CreateGameSessionDto) {
    const userRole = await this.guildService.getUserRole(
      userId,
      createGameSessionDto.guildId,
    );

    if (!userRole) {
      throw new ForbiddenException('User doesn`t belong to this guild!');
    }

    const createdSession = this.gameSessionsRepository.create({
      ...createGameSessionDto,
      creatorId: userId,
      status: Status.SCHEDULED,
    });

    return this.gameSessionsRepository.save(createdSession);
  }

  async findAll(sessionFilterDto?: SessionFilterDto) {
    const gameSessions = this.gameSessionsRepository
      .createQueryBuilder()
      .leftJoinAndSelect('game-sessions.creator', 'user')
      .leftJoinAndSelect('game-sessions.guild', 'guild');

    if (sessionFilterDto.guildId) {
      gameSessions.andWhere('game-sessions.guildId = :guildId', {
        guildId: sessionFilterDto.guildId,
      });
    }
    if (sessionFilterDto.gameName) {
      gameSessions.andWhere('game-sessions.gameName = :gameName', {
        gameName: sessionFilterDto.gameName,
      });
    }
    if (sessionFilterDto.status) {
      gameSessions.andWhere('game-sessions.gameName = :status', {
        status: sessionFilterDto.status,
      });
    }

    return gameSessions.getMany();
  }

  async findOne(sessionId: number) {
    const gameSession = await this.gameSessionsRepository.findOne({
      where: { id: sessionId },
      relations: ['guild', 'creator', 'sessionParticipants.user'],
    });

    if (!gameSession) {
      throw new NotFoundException('Session with this id doesn`t exist!');
    }

    return gameSession;
  }
}
