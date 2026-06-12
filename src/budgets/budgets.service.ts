import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './schemas/budget.schema';
import { Model } from 'mongoose';
import { CreateBudgetDTO } from './dto/create-budget.dto';
import { UpdateBudgetDTO } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
    constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) { }

    async createBudget(createBudgetDTO: CreateBudgetDTO, userId: string) {
        const existingBudget = await this.budgetModel.findOne({
            user: userId,
            category: createBudgetDTO.category,
        }).lean()

        if (existingBudget) {
            throw new ConflictException(
                'Budget already exists for this category',
            );
        }

        const budget = await this.budgetModel.create({
            ...createBudgetDTO,
            user: userId
        })

        return budget.toObject()
    }

    async getBudget(userId: string, budgetId: string) {
        const budget = await this.budgetModel.findOne({ _id: budgetId, user: userId }).lean()
        if (!budget) {
            throw new NotFoundException('Budget not found')
        }
        return budget
    }

    async getAllBudgets(userId: string) {
        const budgets = await this.budgetModel
            .find({ user: userId })
            .select('-user')
            .populate('category')
            .lean()

        const totalBudget = budgets.reduce(
            (sum, budget) => sum + budget.amount,
            0,
        );

        return {
            budgets,
            totalBudget
        }
    }

    async updateBudget(updateBudgetDTO: UpdateBudgetDTO, userId: string, budgetId: string) {
        const updatedBudget = await this.budgetModel.findOneAndUpdate(
            {
                _id: budgetId,
                user: userId,
            },
            updateBudgetDTO,
            {
                new: true,
                runValidators: true,
            }
        ).select('-user').populate('category').lean();

        if(!updatedBudget){
            throw new NotFoundException('Budget not found')
        }

        return updatedBudget
    }

    async deleteBudget(userId: string, budgetId: string) {
        const budget = await this.budgetModel.findOne({ _id: budgetId, user: userId })
        if (!budget) {
            throw new NotFoundException('Budget Not Found')
        }

        return await this.budgetModel.findByIdAndDelete(budget.id).lean()
    }
}
