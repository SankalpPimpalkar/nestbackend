import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { AuthGuard } from './auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

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
        return this.authService.currentUserProfile(req)
    }

    @Patch('profile')
    @UseGuards(AuthGuard)
    async updateUserInfo(@Body() updateUserDTO: UpdateUserDTO, @Req() req: Request) {
        const userId = req['user']._id
        if (updateUserDTO.password) {
            const hashedPassword = await bcrypt.hash(updateUserDTO.password, 10)
            updateUserDTO.password = hashedPassword
        }
        const updatedUser = await this.authService.updateUser(userId, updateUserDTO)

        return {
            data: {
                _id: updatedUser._id,
                fname: updatedUser.fname,
                lname: updatedUser.lname,
                email: updatedUser.email
            }
        }
    }
}
