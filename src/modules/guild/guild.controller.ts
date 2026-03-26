import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
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
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

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

  @Get(':id')
  @UseGuards(JWTAuthGuard)
  getGuild(@CurrentUser() user: User, @Param('id') id: string) {
    return this.guildService.findOne(user.id, +id);
  }

  @Post(':id/members')
  @UseGuards(JWTAuthGuard)
  addmember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.guildService.addMember(user.id, +id, addMemberDto);
  }

  @Post(':id/leave')
  @UseGuards(JWTAuthGuard)
  leaveGuild(@CurrentUser() user: User, @Param('id') id: string) {
    return this.guildService.leaveGuild(user.id, +id);
  }

  @Get(':id/leaderboard')
  @Public()
  showLeaderboard(@Param('id') guildId: string) {
    return this.guildService.showGuildLeaderboard(+guildId);
  }

  @Delete(':id/members/:targetUserId')
  @UseGuards(JWTAuthGuard)
  removeMember(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.guildService.removeMember(user.id, +id, +targetUserId);
  }

  @Patch(':id/members/:targetUserId/role')
  @UseGuards(JWTAuthGuard)
  updateMemberRole(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('targetUserId') targetUserId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    return this.guildService.updateMemberRole(
      user.id,
      +id,
      +targetUserId,
      updateMemberRoleDto,
    );
  }
}
