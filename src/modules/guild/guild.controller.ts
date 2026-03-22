import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuildService } from './guild.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreateGuildDto } from './dto/create-guild.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('guilds')
export class GuildController {
  constructor(private guildService: GuildService) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  createGuild(
    @CurrentUser() user: User,
    @Body() createGuildDto: CreateGuildDto,
  ) {
    return this.guildService.create(user.id, createGuildDto);
  }

  @Get()
  @Public()
  getAllGuilds(
    @Query('isPublic', new ParseBoolPipe({ optional: true }))
    isPublic?: boolean,
  ) {
    return this.guildService.findAll(isPublic);
  }

  @Get('my')
  @UseGuards(JWTAuthGuard)
  getMyGuild(@CurrentUser() user: User) {
    return this.guildService.findMyGuilds(user.id);
  }
}
