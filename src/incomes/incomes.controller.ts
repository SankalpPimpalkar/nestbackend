import { Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateIncomeDTO } from './dto/create-income.dto';
import mongoose from 'mongoose';
import { UpdateIncomeDTO } from './dto/update-income.dto';

@Controller('incomes')
export class IncomesController {
    constructor(
        private readonly incomeService: IncomesService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async addIncome(createIncomeDTO: CreateIncomeDTO, @Req() req: Request) {
        const userId = req['user']._id
        const income = await this.incomeService.addUserIncome(createIncomeDTO, userId)
        return {
            data: income
        }
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllIncomes(@Req() req: Request) {
        const userId = req['user']._id
        const income = await this.incomeService.getAllUserIncomes(userId)
        return {
            data: income
        }
    }

    @Delete(':incomeId')
    @UseGuards(AuthGuard)
    async deleteIncome(@Param('incomeId') incomeId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedCategory = await this.incomeService.removeUserIncome(incomeId, userId)
        return {
            data: deletedCategory
        }
    }

    @Patch(':incomeId')
    @UseGuards(AuthGuard)
    async updateIncomeInfo(
        @Param('incomeId') incomeId: mongoose.Types.ObjectId,
        @Req() req: Request,
        updateIncomeDTO: UpdateIncomeDTO
    ) {
        const userId = req['user']._id
        const income = await this.incomeService.updateUserIncome(updateIncomeDTO, incomeId, userId)
        return {
            data: income
        }
    }
}
