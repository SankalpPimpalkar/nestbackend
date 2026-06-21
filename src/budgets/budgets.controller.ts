import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDTO } from './dto/create-budget.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import mongoose from 'mongoose';
import { UpdateBudgetDTO } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
    constructor(
        private readonly budgetsService: BudgetsService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createBudget(@Body() createBudgetDTO: CreateBudgetDTO, @Req() req: Request) {
        const userId = req['user']._id
        const budget = await this.budgetsService.addBudget(createBudgetDTO, userId)
        return {
            data: budget
        }
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllUserBudgets(@Req() req: Request) {
        const userId = req['user']._id
        const budgets = await this.budgetsService.getUserBudgets(userId)
        return {
            data: budgets
        }
    }

    @Delete(':budgetId')
    @UseGuards(AuthGuard)
    async deleteCategory(@Param('budgetId') budgetId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedBudget = await this.budgetsService.removeBudget(budgetId, userId)
        return {
            data: deletedBudget
        }
    }

    @Patch(':budgetId')
    @UseGuards(AuthGuard)
    async updateCategory(
        @Param('budgetId') budgetId: mongoose.Types.ObjectId,
        @Req() req: Request,
        updateBudgetDTO: UpdateBudgetDTO) {
        const userId = req['user']._id
        const budget = await this.budgetsService.updateBudget(budgetId, userId, updateBudgetDTO)
        return {
            data: budget
        }
    }
}
