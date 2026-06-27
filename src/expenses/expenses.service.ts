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
        userId: mongoose.Types.ObjectId
    ) {
        const expense = await this.expenseModel.create({
            ...createExpenseDTO,
            user: userId
        })

        return expense.toObject()
    }

    async getAllExpenses(
        userId: mongoose.Types.ObjectId,
        page: number = 1,
        limit: number = 10,
        category: string = "",
        search: string = "",
        from?: Date,
        to?: Date
    ) {
        const filters: any = {};
        const datefilter: any = {};
        const expenseMatch: any = { user: userId }

        if (from) {
            datefilter.$gte = new Date(from);
        }

        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            datefilter.$lte = toDate;
        }

        if (Object.keys(datefilter).length) {
            expenseMatch.createdAt = datefilter;
        }

        if (category) {
            filters["category.name"] = {
                $regex: category,
                $options: "i"
            };
        }

        if (search) {
            filters["title"] = {
                $regex: search,
                $options: "i"
            };
        }

        const expenses = await this.expenseModel.aggregate([
            { $match: expenseMatch },
            {
                $lookup: {
                    from: "categories",
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $match: filters
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * 10
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    amount: 1,
                    categoryName: "$category.name"
                }
            }
        ])
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
            .findOneAndUpdate({ _id: expenseId, user: userId }, updateExpenseDTO, { returnDocument: 'after' })

        if (!expense) {
            throw new ConflictException('Expense does not exists')
        }

        return expense
    }
}
