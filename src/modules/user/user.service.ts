import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { SessionParticipant } from 'src/entities/session-participant.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SessionParticipant)
    private sessionParticipantRepository: Repository<SessionParticipant>,
  ) {}

  async findOne(id: number) {
    const currentUser = await this.userRepository.findOneBy({ id: id });
    if (!currentUser) {
      throw new UnauthorizedException('User with this id was not found');
    }
    return currentUser;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const currentUser = await this.userRepository.findOneBy(user);
    if (!currentUser) {
      throw new UnauthorizedException('User was not found');
    }
    return this.userRepository.update(user, updateUserDto);
  }

  async showStats(userId: number) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User don`t exist!');
    }

    const gamesPlayed = await this.sessionParticipantRepository.countBy({
      userId,
    });

    const MVP = await this.sessionParticipantRepository.countBy({
      userId,
      isMVP: true,
    });

    return {
      level: user.level,
      totalScore: user.totalScore,
      gamesPlayed,
      MVP,
    };
  }
}
