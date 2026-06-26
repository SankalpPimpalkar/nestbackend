import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import mongoose from 'mongoose';
import { UpdateExpenseDTO } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Expense')
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expenseService: ExpensesService) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createExpense(@Body() createExpenseDTO: CreateExpenseDTO, @Req() req: Request) {
        const userId = req['user']._id
        const expense = await this.expenseService.createExpense(createExpenseDTO, userId)
        return {
            data: expense
        }
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllExpenses(@Query('categoryId') categoryId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const expense = await this.expenseService.getAllExpenses(userId, categoryId)
        return {
            data: expense
        }
    }

    @Delete(':expenseId')
    @UseGuards(AuthGuard)
    async deleteExpense(@Param('expenseId') expenseId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedExpense = await this.expenseService.deleteExpense(userId, expenseId)
        return {
            data: deletedExpense
        }
    }

    @Patch(':expenseId')
    @UseGuards(AuthGuard)
    async updateIncomeInfo(
        @Param('expenseId') expenseId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body() updateExpenseDTO: UpdateExpenseDTO
    ) {
        const userId = req['user']._id
        const expense = await this.expenseService.updateExpense(updateExpenseDTO, userId, expenseId)
        return {
            data: expense
        }
    }
}
