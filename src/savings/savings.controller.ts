import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import ResponseHandler from 'src/common/utils/ResponseHandler';
import { SavingsService } from './savings.service';
import { CreateSavingDTO } from './dto/create-saving.dto';
import mongoose from 'mongoose';
import { UpdateSavingDTO } from './dto/update-saving.dto';


@Controller('savings')
export class SavingsController {
    constructor(
        private readonly savingsService: SavingsService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createSaving(
        @Req() req: Request,
        @Body() createSavingDTO: CreateSavingDTO
    ) {
        const userId = req['user']._id
        const saving = await this.savingsService.createSaving(userId, createSavingDTO)
        return ResponseHandler(HttpStatus.CREATED, 'New Savings Added', saving)
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllSavings(
        @Req() req: Request
    ) {
        const userId = req['user']._id
        const saving = await this.savingsService.getAllSavings(userId)
        return ResponseHandler(HttpStatus.CREATED, 'All Savings Fetched', saving)
    }

    @Delete(':savingsId')
    @UseGuards(AuthGuard)
    async deleteSavings(@Param('savingsId') savingsId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedSavings = await this.savingsService.deleteSaving(userId, savingsId)

        return ResponseHandler(
            HttpStatus.OK,
            'Savings Deleted',
            deletedSavings
        )
    }

    @Patch(':savingsId')
    @UseGuards(AuthGuard)
    async updateIncomeInfo(
        @Param('savingsId') savingsId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body(ValidationPipe) updateSavingDTO: UpdateSavingDTO
    ) {
        const userId = req['user']._id
        const savings = await this.savingsService.updateSaving(userId, savingsId, updateSavingDTO)

        return ResponseHandler(
            HttpStatus.OK,
            'Savings Updated',
            savings
        )
    }
}