import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './schemas/budget.schema';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { Expense } from './schemas/expense.schema';
import { Income } from './schemas/income.schema';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectModel(Budget.name) private budgetModel: Model<Budget>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Expense.name) private expenseModel: Model<Expense>,
        @InjectModel(Income.name) private incomeModel: Model<Income>
    ) { }

    
}
