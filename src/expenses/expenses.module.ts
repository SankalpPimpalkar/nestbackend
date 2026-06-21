import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './expenses.schema';

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }])],
    controllers: [ExpensesController],
    providers: [ExpensesService]
})
export class ExpensesModule { }
