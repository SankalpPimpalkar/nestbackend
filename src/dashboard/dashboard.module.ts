import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { Budget, BudgetSchema } from 'src/budgets/budgets.schema';
import { Category, CategorySchema } from 'src/categories/categories.schema';
import { Expense, ExpenseSchema } from 'src/expenses/expenses.schema';
import { Income, IncomeSchema } from 'src/incomes/incomes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Income.name, schema: IncomeSchema },
    ]),
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
