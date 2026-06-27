import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './budgets.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBudgetDTO } from './dto/create-budget.dto';
import { Category } from 'src/categories/categories.schema';
import { UpdateBudgetDTO } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
    constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) { }

    async addBudget(createBudgetDTO: CreateBudgetDTO, userId: mongoose.Types.ObjectId) {
        const existingBudget = await this.budgetModel
            .findOne({ category: createBudgetDTO.category, user: userId })
            .populate<{ category: Category }>('category')

        if (existingBudget) {
            throw new ConflictException(`Budget for ${existingBudget.category.name} category already exists`)
        }

        const budget = await this.budgetModel
            .create({ ...createBudgetDTO, user: userId })

        return budget.toObject()
    }

    async getUserBudgets(userId: mongoose.Types.ObjectId) {
        const budgets = await this.budgetModel
            .find({ user: userId })
            .select('-user -__v')
            .populate('category', 'name amount')
            .lean()

        return budgets
    }

    async removeBudget(budgetId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
        const budget = await this.budgetModel
            .findOneAndDelete({ _id: budgetId, user: userId })
            .select('-user -__v')
            .populate('category', 'name amount')
            .lean()

        if (!budget) {
            throw new ConflictException('Budget does not exists')
        }

        return budget
    }

    async updateBudget(
        budgetId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
        updateBudgetDTO: UpdateBudgetDTO
    ) {
        if (updateBudgetDTO.category) {
            const existingBudget = await this.budgetModel
                .findOne({ category: updateBudgetDTO.category, user: userId })
                .populate<{ category: Category }>('category')
            if (existingBudget) {
                throw new ConflictException(`Budget for ${existingBudget.category.name} category already exists`)
            }
        }

        const budget = await this.budgetModel
            .findOneAndUpdate({ _id: budgetId, user: userId }, updateBudgetDTO, { returnDocument: 'after' })
            .select('-user -__v')
            .populate('category', 'name amount')
            .lean()

        if (!budget) {
            throw new ConflictException('Budget does not exists')
        }

        return budget
    }
}