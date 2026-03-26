import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Guild } from 'src/entities/guild.entity';
import { UserGuild } from 'src/entities/user-guild.entity';
import { Repository } from 'typeorm';
import { CreateGuildDto } from './dto/create-guild.dto';
import { GuildRoles } from 'src/enums/guild-roles.enum';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

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
      relations: ['guild'],
    });
  }

  async getUserRole(userId: number, guildId: number) {
    const guildRecord = await this.userGuildRepository.findOneBy({
      guildId,
      userId,
    });

    if (!guildRecord) return null;
    return guildRecord.role;
  }

  async findOne(userId: number, guildId: number) {
    const userRole = await this.getUserRole(userId, guildId);
    if (!userRole) {
      throw new ForbiddenException('You are not a member of this guild');
    }

    const guildRecord = await this.guildRepository.findOne({
      where: { id: guildId },
      relations: ['usersJoined', 'usersJoined.user'],
    });

    if (!guildRecord) {
      throw new NotFoundException('Guild with this id wasn`t found!');
    }
    if (!(await this.getUserRole(userId, guildId))) {
      throw new ForbiddenException('You`re not a member of this guild!');
    }

    return guildRecord;
  }

  async addMember(userId: number, guildId: number, addMemberDto: AddMemberDto) {
    const currentGuild = await this.guildRepository.findOne({
      where: { id: guildId },
      relations: ['usersJoined'],
    });

    const userRole = await this.getUserRole(userId, guildId);
    if (!userRole) {
      throw new ForbiddenException('You`re not a member of this guild!');
    }

    if (userRole !== GuildRoles.OWNER && userRole !== GuildRoles.ADMIN) {
      throw new ForbiddenException(
        'You`re not an owner or an admin of this guild!',
      );
    }

    if (currentGuild.usersJoined.length >= currentGuild.maxMembers) {
      throw new ConflictException('Guild has reached maximum users!');
    }

    if (
      await this.userGuildRepository.findOneBy({
        userId: addMemberDto.targetUserId,
        guildId,
      })
    ) {
      throw new ConflictException('User already in this guild!');
    }

    const addedMember = this.userGuildRepository.create({
      userId: addMemberDto.targetUserId,
      guildId: guildId,
      role: addMemberDto.role || GuildRoles.MEMBER,
    });
    return this.userGuildRepository.save(addedMember);
  }

  async removeMember(userId: number, guildId: number, targetUserId: number) {
    const userRole = await this.getUserRole(userId, guildId);
    if (!userRole) {
      throw new ForbiddenException('You`re not a member of this guild!');
    }

    if (userRole !== GuildRoles.OWNER && userRole !== GuildRoles.ADMIN) {
      throw new ForbiddenException(
        'You`re not an owner or an admin of this guild!',
      );
    }

    const targetMembership = await this.userGuildRepository.findOne({
      where: { userId: targetUserId, guildId }, // ← Add guildId
    });

    if (!targetMembership) {
      throw new NotFoundException('User is not a member of this guild');
    }

    if (targetMembership.role === GuildRoles.OWNER) {
      const ownerCount = await this.userGuildRepository.count({
        where: { guildId, role: GuildRoles.OWNER },
      });

      if (ownerCount <= 1) {
        throw new ConflictException('Cannot remove the last owner');
      }
    }

    await this.userGuildRepository.delete({ userId: targetUserId, guildId });
    return {
      message: 'success',
    };
  }

  async updateMemberRole(
    userId: number,
    guildId: number,
    targetUserId: number,
    updateMemberRoleDto: UpdateMemberRoleDto,
  ) {
    const userRole = await this.getUserRole(userId, guildId);
    if (!userRole) {
      throw new ForbiddenException('You`re not a member of this guild!');
    }

    if (userRole !== GuildRoles.OWNER) {
      throw new ForbiddenException('You`re not an owner of this guild!');
    }

    const targetUser = await this.userGuildRepository.findOneBy({
      guildId,
      userId: targetUserId,
    });

    if (!targetUser) {
      throw new ForbiddenException('User wasn`t found in this guild!');
    }

    if (
      targetUser.role === GuildRoles.OWNER &&
      updateMemberRoleDto.role !== GuildRoles.OWNER
    ) {
      const ownerCount = await this.userGuildRepository.count({
        where: { guildId, role: GuildRoles.OWNER },
      });

      if (ownerCount <= 1) {
        throw new ConflictException('Cannot demote the last owner');
      }
    }

    await this.userGuildRepository.update(
      { userId: targetUserId, guildId: guildId },
      updateMemberRoleDto,
    );

    return this.userGuildRepository.findOne({
      where: { userId: targetUserId, guildId },
      relations: ['user'],
    });
  }

  async leaveGuild(userId: number, guildId: number) {
    const currentUserMembership = await this.userGuildRepository.findOneBy({
      userId,
      guildId,
    });

    if (!currentUserMembership) {
      throw new ForbiddenException('You`re not a member of this guild!');
    }

    if (
      (await this.userGuildRepository.countBy({
        guildId,
        role: GuildRoles.OWNER,
      })) === 1 &&
      (await this.getUserRole(userId, guildId)) === GuildRoles.OWNER
    ) {
      throw new ConflictException(
        'You are the last owner. Transfer ownership or delete the guild.',
      );
    }

    await this.userGuildRepository.delete(currentUserMembership);

    return {
      message: 'success',
    };
  }

  async showGuildLeaderboard(guildId: number) {
    const guildUsers = await this.userGuildRepository.find({
      where: { guildId },
      relations: ['user'],
      order: {
        user: {
          totalScore: 'DESC',
        },
      },
      take: 10,
    });

    return guildUsers;
  }
}
