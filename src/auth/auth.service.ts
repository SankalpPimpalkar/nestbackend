import { Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express'
import { LoginAuthDTO } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async registerUser(registerAuthDTO: RegisterAuthDto, @Res({ passthrough: true }) response: Response) {
        const user = await this.usersService.createUser(registerAuthDTO)
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        response.cookie('access_token', token)
        return {
            user,
            access_token: token
        }
    }

    async loginUser(loginAuthDTO: LoginAuthDTO, @Res({ passthrough: true }) response: Response) {
        const user = await this.usersService.getUserByEmail(loginAuthDTO.email)
        const { password, __v, ...userWithoutPassword } = user.toObject()

        const isCorrectPass = password === loginAuthDTO.password
        if (isCorrectPass) {
            throw new UnauthorizedException('Incorrect Password')
        }
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        response.cookie('access_token', token)
        return {
            user: userWithoutPassword,
            access_token: token
        }
    }

    async getProfile(@Req() request: Request) {
        const token = request.cookies['access_token']
        if (!token) {
            throw new NotFoundException('Token not found')
        }
        const { sub } = await this.jwtService.verify(token)
        if (!sub) {
            throw new UnauthorizedException('Invalid Token')
        }

        const user = await this.usersService.getUserById(sub)
        return { user }
    }
}
