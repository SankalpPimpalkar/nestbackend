import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService
    ) { }

    async registerUser(createUserDTO: CreateUserDTO) {
        return await this.userService.createUser(createUserDTO)
    }

    async loginUser(loginUserDTO: LoginUserDTO) {
        const user = await this.userService.getUserByEmail(loginUserDTO.email)
        const isCorrectPassword = await bcrypt.compare(loginUserDTO.password, user.password)

        if(!isCorrectPassword){
            throw new UnauthorizedException('Wrong Password')
        }

        return user
    }
}
