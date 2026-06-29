import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDTO } from './dto/create-budget.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import mongoose from 'mongoose';
import { UpdateBudgetDTO } from './dto/update-budget.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseHandler from 'src/common/utils/ResponseHandler';

@ApiTags('Budget')
@Controller('budgets')
export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) {}

    @Post('')
    @UseGuards(AuthGuard)
    async createBudget(
        @Body(ValidationPipe) createBudgetDTO: CreateBudgetDTO,
        @Req() req: Request,
    ) {
        const userId = req['user']._id;
        const budget = await this.budgetsService.addBudget(
            createBudgetDTO,
            userId,
        );

        return ResponseHandler(HttpStatus.CREATED, 'Budget Added', budget);
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllUserBudgets(@Req() req: Request) {
        const userId = req['user']._id;
        const budgets = await this.budgetsService.getUserBudgets(userId);

        return ResponseHandler(HttpStatus.OK, 'User Budgets Fetched', budgets);
    }

    @Delete(':budgetId')
    @UseGuards(AuthGuard)
    async deleteCategory(
        @Param('budgetId') budgetId: mongoose.Types.ObjectId,
        @Req() req: Request,
    ) {
        const userId = req['user']._id;
        const deletedBudget = await this.budgetsService.removeBudget(
            budgetId,
            userId,
        );

        return ResponseHandler(HttpStatus.OK, 'Budget Deleted', deletedBudget);
    }

    @Patch(':budgetId')
    @UseGuards(AuthGuard)
    async updateCategory(
        @Param('budgetId') budgetId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body(ValidationPipe) updateBudgetDTO: UpdateBudgetDTO,
    ) {
        const userId = req['user']._id;
        const budget = await this.budgetsService.updateBudget(
            budgetId,
            userId,
            updateBudgetDTO,
        );

        return ResponseHandler(HttpStatus.OK, 'Budget Updated', budget);
    }
}
