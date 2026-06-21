import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Income } from './incomes.schema';
import mongoose, { Model } from 'mongoose';
import { CreateIncomeDTO } from './dto/create-income.dto';
import { UpdateIncomeDTO } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
    constructor(@InjectModel(Income.name) private incomeModel: Model<Income>) { }

    async addUserIncome(createIncomeDTO: CreateIncomeDTO, userId: mongoose.Types.ObjectId) {
        const existingIncome = await this.incomeModel
            .findOne({ user: userId, source: createIncomeDTO.source })
        if (!existingIncome) {
            throw new ConflictException(`You already added ${createIncomeDTO.source} as your income source`)
        }

        const income = await this.incomeModel.create({
            ...createIncomeDTO,
            user: userId
        })

        return income.toObject()
    }

    async getAllUserIncomes(userId: mongoose.Types.ObjectId) {
        const incomes = await this.incomeModel
        .find({ user: userId })
        .select('-user -__v')
        .lean()
        
        return incomes
    }

    async removeUserIncome(incomeId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
        const income = await this.incomeModel
            .findOneAndDelete({ _id: incomeId, user: userId })
            .select('-user -__v')
            .lean()

        if (!income) {
            throw new ConflictException('This income source does not exist')
        }

        return income
    }

    async updateUserIncome(
        updateIncomeDTO: UpdateIncomeDTO,
        incomeId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId
    ) {
        const income = await this.incomeModel
            .findOneAndUpdate({ _id: incomeId, user: userId }, updateIncomeDTO)
            .select('-user -__v')
            .lean()

        if (!income) {
            throw new ConflictException('This income source does not exist')
        }

        return income
    }
}
