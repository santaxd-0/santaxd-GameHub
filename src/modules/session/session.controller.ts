import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GameSessionsService } from './session.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateGameSessionDto } from './dto/create-session.dto';
import { SessionFilterDto } from './dto/session-filter.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('sessions')
export class GameSessionsController {
  constructor(private gameSessionsService: GameSessionsService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  create(
    @CurrentUser() user: User,
    @Body() createGameSessionDto: CreateGameSessionDto,
  ) {
    return this.gameSessionsService.create(user.id, createGameSessionDto);
  }

  @Get()
  @Public()
  findAll(@Query() sessionFilterDto?: SessionFilterDto) {
    return this.gameSessionsService.findAll(sessionFilterDto);
  }
  
  @Get(":id")
  findOne(
    @Param("id") sessionId: string
  ) {
    return this.gameSessionsService.findOne(+sessionId);
  }
}
