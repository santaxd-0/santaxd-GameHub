import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {};

    async findOne(
        id: number
    ) {
        const currentUser = await this.userRepository.findOneBy({id: id});
        if (!currentUser) {
            throw new UnauthorizedException("User with this id was not found");
        }
        return currentUser;
    }

    async update (
        user: User,
        updateUserDto: UpdateUserDto
    ) {
        const currentUser = await this.userRepository.findOneBy(user);
        if (!currentUser) {
            throw new UnauthorizedException("User was not found");
        }
        return this.userRepository.update(user, updateUserDto);
    }
}