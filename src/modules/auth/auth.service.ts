import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async checkingUserAlreadyExists(username: string, email: string) {
    const count = await this.userRepository.count({
      where: [{ username }, { email }],
    });

    return count > 0;
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.checkingUserAlreadyExists(
      registerDto.username,
      registerDto.email,
    );

    if (userExists)
      throw new ConflictException(
        'User with this email or username already exists!',
      );

    const hashingPassword = await bcrypt.hash(registerDto.password, 10);

    const createdUser = this.userRepository.create({
      ...registerDto,
      password: hashingPassword,
    });
    await this.userRepository.save(createdUser);
    return this.userPayload(createdUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Wrong email or password');
    }

    return this.userPayload(user);
  }

  async userPayload(user: User) {
    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        username: user.username,
      }),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        gamertag: user.gamertag,
      },
    };
  }
}
