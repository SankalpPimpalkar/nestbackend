import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateIncomeDTO } from './dto/create-income.dto';
import mongoose from 'mongoose';
import { UpdateIncomeDTO } from './dto/update-income.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseHandler from 'src/utils/ResponseHandler';

@ApiTags('Income')
@Controller('incomes')
export class IncomesController {
    constructor(
        private readonly incomeService: IncomesService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async addIncome(@Body(ValidationPipe) createIncomeDTO: CreateIncomeDTO, @Req() req: Request) {
        const userId = req['user']._id
        const income = await this.incomeService.addUserIncome(createIncomeDTO, userId)

        return ResponseHandler(
            HttpStatus.CREATED,
            'Income Added',
            income
        )
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllIncomes(@Req() req: Request) {
        const userId = req['user']._id
        const incomes = await this.incomeService.getAllUserIncomes(userId)

        return ResponseHandler(
            HttpStatus.OK,
            'Incomes Fetched',
            incomes
        )
    }

    @Delete(':incomeId')
    @UseGuards(AuthGuard)
    async deleteIncome(@Param('incomeId') incomeId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedIncome = await this.incomeService.removeUserIncome(incomeId, userId)

        return ResponseHandler(
            HttpStatus.OK,
            'Income Deleted',
            deletedIncome
        )
    }

    @Patch(':incomeId')
    @UseGuards(AuthGuard)
    async updateIncomeInfo(
        @Param('incomeId') incomeId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body(ValidationPipe) updateIncomeDTO: UpdateIncomeDTO
    ) {
        const userId = req['user']._id
        const income = await this.incomeService.updateUserIncome(updateIncomeDTO, incomeId, userId)

        return ResponseHandler(
            HttpStatus.OK,
            'Income Updated',
            income
        )
    }
}
