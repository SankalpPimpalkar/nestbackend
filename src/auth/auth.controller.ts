import { Body, Controller, Get, HttpStatus, Patch, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from './dto/login-user.dto';
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { AuthGuard } from './auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseHandler from 'src/utils/ResponseHandler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService
    ) { }

    @Post('register')
    async registerUser(@Body(ValidationPipe) createUserDTO: CreateUserDTO, @Res({ passthrough: true }) res: Response) {
        const hashedPassword = await bcrypt.hash(createUserDTO.password, 10)
        createUserDTO.password = hashedPassword

        const user = await this.authService.registerUser(createUserDTO)
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        res.cookie('access_token', token)

        return ResponseHandler(
            HttpStatus.CREATED,
            'User Created',
            {
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                access_token: token
            },
        )
    }

    @Post('login')
    async loginUser(@Body(ValidationPipe) loginUserDTO: LoginUserDTO, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.loginUser(loginUserDTO)
        const payload = { sub: user._id }
        const token = await this.jwtService.signAsync(payload)
        res.cookie('access_token', token)

        return ResponseHandler(
            HttpStatus.OK,
            'User Logged In',
            {
                _id: user._id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                access_token: token
            },
        )
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    async getUserProfile(@Req() req: Request) {
        const userData = await this.authService.currentUserProfile(req)

        return ResponseHandler(
            HttpStatus.OK,
            'User Profile Fetched',
            userData
        )
    }

    @Patch('profile')
    @UseGuards(AuthGuard)
    async updateUserInfo(@Body(ValidationPipe) updateUserDTO: UpdateUserDTO, @Req() req: Request) {
        const userId = req['user']._id
        if (updateUserDTO.password) {
            const hashedPassword = await bcrypt.hash(updateUserDTO.password, 10)
            updateUserDTO.password = hashedPassword
        }
        const updatedUser = await this.authService.updateUser(userId, updateUserDTO)

        return ResponseHandler(
            HttpStatus.OK,
            'User Details Updated',
            updatedUser
        )
    }
}
