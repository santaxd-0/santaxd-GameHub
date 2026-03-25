import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameSessions } from 'src/entities/game-sessions.entity';
import { Repository } from 'typeorm';
import { CreateGameSessionDto } from '../dto/create-session.dto';
import { GuildService } from '../../guild/guild.service';
import { Status } from 'src/enums/status.enum';
import { SessionFilterDto } from '../dto/session-filter.dto';
import { BadRequestException } from '@nestjs/common';
import { GuildRoles } from 'src/enums/guild-roles.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectRepository(GameSessions)
    private gameSessionsRepository: Repository<GameSessions>,
    @Inject(GuildService)
    private guildService: GuildService,
    private eventEmitter: EventEmitter2,
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
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.creator', 'creator')
      .leftJoinAndSelect('session.guild', 'guild');

    if (sessionFilterDto) {
      if (sessionFilterDto.guildId) {
        gameSessions.andWhere('session.guildId = :guildId', {
          guildId: sessionFilterDto.guildId,
        });
      }
      if (sessionFilterDto.gameName) {
        gameSessions.andWhere('session.gameName ILIKE :gameName', {
          gameName: `%${sessionFilterDto.gameName}%`,
        });
      }
      if (sessionFilterDto.status) {
        gameSessions.andWhere('session.status = :status', {
          status: sessionFilterDto.status,
        });
      }
    }

    gameSessions.orderBy('session.scheduledAt', 'ASC');

    return gameSessions.getMany();
  }

  async findOne(sessionId: number) {
    const gameSession = await this.gameSessionsRepository.findOne({
      where: { id: sessionId },
      relations: [
        'guild',
        'creator',
        'sessionParticipants',
        'sessionParticipants.user',
      ],
    });

    if (!gameSession) {
      throw new NotFoundException('Session with this id doesn`t exist!');
    }

    return gameSession;
  }

  async changeStatus(userId: number, sessionId: number) {
    const gameSession = await this.findOne(sessionId);

    if (gameSession.status === Status.COMPLETED) {
      throw new BadRequestException('Session is already completed!');
    }

    const userRoots = await this.guildService.getUserRole(
      userId,
      gameSession.guildId,
    );

    if (
      (userRoots !== GuildRoles.OWNER && userRoots !== GuildRoles.ADMIN) ||
      gameSession.creatorId === userId
    ) {
      throw new ForbiddenException('Only admin or owner can do this!');
    }

    await this.gameSessionsRepository.update(
      { id: sessionId },
      { status: Status.COMPLETED },
    );

    this.eventEmitter.emit('session.completed', {
      sessionId,
    });

    return {
      message: 'Status changed succesfully!',
    };
  }
}
