import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) { }

    @Post('register')
    async registerUser(@Body() createUserDTO: CreateUserDTO, @Res({ passthrough: true }) res: Response) {
        const hashedPassword = await bcrypt.hash(createUserDTO.password, 10)
        createUserDTO.password = hashedPassword

        const user = await this.authService.registerUser(createUserDTO)
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        res.cookie('access_token', token)

        return {
            data: {
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            },
            access_token: token
        }
    }

    @Post('login')
    async loginUser(@Body() loginUserDTO: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.loginUser(loginUserDTO)
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        res.cookie('access_token', token)

        return {
            data: {
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            },
            access_token: token
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async getUserProfile(@Req() req: Request) {
        return req['user']
    }
}
