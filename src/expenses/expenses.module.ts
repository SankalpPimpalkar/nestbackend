import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schemas/expense.schema';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Income, IncomeSchema } from './schemas/income.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Budget.name, schema: BudgetSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: Income.name, schema: IncomeSchema },
    ])
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService]
})
export class ExpensesModule { }
