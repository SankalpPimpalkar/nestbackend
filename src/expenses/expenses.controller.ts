import { Body, Controller, Delete, Get, HttpStatus, Param, ParseDatePipe, ParseIntPipe, Patch, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDTO } from './dto/create-expense.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import mongoose from 'mongoose';
import { UpdateExpenseDTO } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseHandler from 'src/utils/ResponseHandler';

@ApiTags('Expense')
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expenseService: ExpensesService) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createExpense(@Body(ValidationPipe) createExpenseDTO: CreateExpenseDTO, @Req() req: Request) {
        const userId = req['user']._id
        const expense = await this.expenseService.createExpense(createExpenseDTO, userId)

        return ResponseHandler(
            HttpStatus.CREATED,
            'Expense Added',
            expense
        )
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllExpenses(
        @Query('search') search: string,
        @Query('category') category: string,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
        @Query('from', new ParseDatePipe({ optional: true })) from: Date,
        @Query('to', new ParseDatePipe({ optional: true })) to: Date,
        @Req() req: Request
    ) {
        const userId = req['user']._id
        const expense = await this.expenseService.getAllExpenses(userId, page, limit, category, search, from, to)

        return ResponseHandler(
            HttpStatus.OK,
            'Expenses Fetched',
            expense
        )
    }

    @Delete(':expenseId')
    @UseGuards(AuthGuard)
    async deleteExpense(@Param('expenseId') expenseId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedExpense = await this.expenseService.deleteExpense(userId, expenseId)

        return ResponseHandler(
            HttpStatus.OK,
            'Expense Deleted',
            deletedExpense
        )
    }

    @Patch(':expenseId')
    @UseGuards(AuthGuard)
    async updateIncomeInfo(
        @Param('expenseId') expenseId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body(ValidationPipe) updateExpenseDTO: UpdateExpenseDTO
    ) {
        const userId = req['user']._id
        const expense = await this.expenseService.updateExpense(updateExpenseDTO, userId, expenseId)

        return ResponseHandler(
            HttpStatus.OK,
            'Expense Updated',
            expense
        )
    }
}
