import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import { UpdateUserDTO } from 'src/auth/dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(createUserDTO: CreateUserDTO) {
        const existingUser = await this.userModel.findOne({
            email: createUserDTO.email,
        });

        if (existingUser) {
            throw new ConflictException(
                `User with email ${createUserDTO.email} already exists`,
            );
        }

        const user = await this.userModel.create(createUserDTO);
        return user.toObject();
    }

    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user.toObject();
    }

    async getUserById(id: string) {
        const user = await this.userModel.findById(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user.toObject();
    }

    async updateUserInfo(id: string, updateUserDTO: UpdateUserDTO) {
        const user = await this.userModel.findByIdAndUpdate(id, updateUserDTO, { returnDocument: 'after' })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user.toObject()
    }
}
