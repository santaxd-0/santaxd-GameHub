import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JWTAuthGuard)
  userProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('me/stats')
  @UseGuards(JWTAuthGuard)
  async userProfileStats(@CurrentUser() user: User) {
    return this.userService.showStats(user.id);
  }

  @Patch('me')
  @UseGuards(JWTAuthGuard)
  async updateUserProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user, updateUserDto);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
