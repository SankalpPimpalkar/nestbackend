import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Budget } from 'src/budgets/budgets.schema';
import { Category } from 'src/categories/categories.schema';
import { Expense } from 'src/expenses/expenses.schema';
import { Income } from 'src/incomes/incomes.schema';
import { User } from 'src/users/users.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Budget.name) private budgetModel: Model<Budget>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Expense.name) private expenseModel: Model<Expense>,
        @InjectModel(Income.name) private incomeModel: Model<Income>,
    ) { }

    async getDashboardData(userId: mongoose.Types.ObjectId, from?: Date, to?: Date) {
        const now = new Date()
        const fromDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1)
        const toDate = to ? new Date(to) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const totalIncome = await this.incomeModel.aggregate([
            { $match: { user: userId, createdAt: { $gte: fromDate, $lte: toDate } } },
            {
                $group: {
                    _id: "$user",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $project: {
                    total: 1,
                    _id: 0
                }
            }
        ])

        const totalExpense = await this.expenseModel.aggregate([
            { $match: { user: userId, createdAt: { $gte: fromDate, $lte: toDate } } },
            {
                $group: {
                    _id: "$user",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $project: {
                    total: 1,
                    _id: 0
                }
            }
        ])

        return {
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            remainingBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0)
        }
    }
}
