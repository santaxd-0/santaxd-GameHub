import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SessionParticipant } from 'src/entities/session-participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SessionParticipant])],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
