import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Budget } from 'src/budgets/budgets.schema';
import { Category } from 'src/categories/categories.schema';
import { Expense } from 'src/expenses/expenses.schema';
import { Income } from 'src/incomes/incomes.schema';
import { User } from 'src/users/users.schema';
import totalIncomeAgreegation from './aggregations/total-income';
import totalExpenseAgreegation from './aggregations/total-expense';
import remainingBudgetAgreegation from './aggregations/remaining-budget';
import topSpendingCategoriesAgreegation from './aggregations/top-spending-category';

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

        const [
            totalIncome,
            totalExpense,
            budgetConsumptions,
            topSpendingCategories
        ] = await Promise.all([
            totalIncomeAgreegation(this.incomeModel, userId, fromDate, toDate),
            totalExpenseAgreegation(this.expenseModel, userId, fromDate, toDate),
            remainingBudgetAgreegation(this.budgetModel, userId, fromDate, toDate),
            topSpendingCategoriesAgreegation(this.expenseModel, userId)
        ])

        return {
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            budgetConsumptions: budgetConsumptions,
            remainingBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            topSpendingCategories: topSpendingCategories
        }
    }
}
