import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
