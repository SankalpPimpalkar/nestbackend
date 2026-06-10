import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(createUserDto: CreateUserDTO) {
        try {
            const existingUser = await this.userModel.findOne({ email: createUserDto.email })
            if (existingUser) {
                throw new ConflictException(`User with email ${createUserDto.email} already exists`)
            }

            const passwordHash = await bcrypt.hash(createUserDto.password, 10)
            const user = await this.userModel.create({
                ...createUserDto,
                password: passwordHash
            })

            const { password, __v, ...userWithoutPassword } = user.toObject()
            return userWithoutPassword

        } catch (error) {
            throw new InternalServerErrorException('Failed to create user')
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.userModel.findOne({ email })
            if (!user) {
                throw new NotFoundException('User not found')
            }
            return user

        } catch (error) {
            throw new InternalServerErrorException('Failed to find user')
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await this.userModel.findById(userId).select('-password -__v')
            if (!user) {
                throw new NotFoundException('User not found')
            }
            return user

        } catch (error) {
            throw new InternalServerErrorException('Failed to find user')
        }
    }

}
