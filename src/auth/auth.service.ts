import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}

    async registerUser(createUserDTO: CreateUserDTO) {
        return await this.userService.createUser(createUserDTO);
    }

    async loginUser(loginUserDTO: LoginUserDTO) {
        const user = await this.userService.getUserByEmail(loginUserDTO.email);
        const isCorrectPassword = await bcrypt.compare(
            loginUserDTO.password,
            user.password,
        );

        if (!isCorrectPassword) {
            throw new UnauthorizedException('Wrong Password');
        }

        return user;
    }

    async updateUser(userId: string, updateUserDTO: UpdateUserDTO) {
        return await this.userService.updateUserInfo(userId, updateUserDTO);
    }

    currentUserProfile(req: Request) {
        return req['user'];
    }
}
