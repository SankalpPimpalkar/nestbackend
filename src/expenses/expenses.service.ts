import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './expenses.schema';
import mongoose, { Model } from 'mongoose';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { UpdateExpenseDTO } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(@InjectModel(Expense.name) private expenseModel: Model<Expense>) { }

    async createExpense(
        createExpenseDTO: CreateExpenseDTO,
        categoryId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId
    ) {
        const expense = await this.expenseModel.create({
            ...createExpenseDTO,
            category: categoryId,
            user: userId
        })

        return expense.toObject()
    }

    async getAllExpenses(
        userId: mongoose.Types.ObjectId,
        categoryId?: mongoose.Types.ObjectId,
    ) {
        const expenses = await this.expenseModel
            .find({
                user: userId,
                ...(categoryId && { category: categoryId }),
            })
            .select('-user -__v')
            .populate('category', '_id name')
            .lean()

        return expenses
    }

    async deleteExpense(userId: mongoose.Types.ObjectId, expenseId: mongoose.Types.ObjectId) {
        const expense = await this.expenseModel
            .findOneAndDelete({ _id: expenseId, user: userId })
            .select('-user -__v')
            .populate('category', '_id name')
            .lean()

        if (!expense) {
            throw new ConflictException('Expense does not exists')
        }

        return expense
    }

    async updateExpense(updateExpenseDTO: UpdateExpenseDTO, userId: mongoose.Types.ObjectId, expenseId: mongoose.Types.ObjectId) {
        const expense = await this.expenseModel
            .findOneAndUpdate({ _id: expenseId, user: userId }, updateExpenseDTO)

        if (!expense) {
            throw new ConflictException('Expense does not exists')
        }

        return expense
    }
}
