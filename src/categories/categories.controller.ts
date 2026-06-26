import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCategoryDTO } from './dto/create-category.dto';
import mongoose from 'mongoose';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import ResponseHandler from 'src/utils/ResponseHandler';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoryService: CategoriesService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createCategory(@Body(ValidationPipe) createCategoryDTO: CreateCategoryDTO, @Req() req: Request) {
        const userId = req['user']._id
        const category = await this.categoryService.createCategory(createCategoryDTO, userId)

        return ResponseHandler(
            HttpStatus.CREATED,
            'Category Added',
            category
        )
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllUserCategories(@Req() req: Request) {
        const userId = req['user']._id
        const categories = await this.categoryService.getAllUserCategories(userId)

        return ResponseHandler(
            HttpStatus.OK,
            'Category Fetched',
            categories
        )
    }

    @Delete(':categoryId')
    @UseGuards(AuthGuard)
    async deleteCategory(@Param('categoryId') categoryId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedCategory = await this.categoryService.deleteCategory(categoryId, userId)

        return ResponseHandler(
            HttpStatus.OK,
            'Category Deleted',
            deletedCategory
        )
    }

    @Patch(':categoryId')
    @UseGuards(AuthGuard)
    async updateCategory(
        @Param('categoryId') categoryId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body(ValidationPipe) updateCategoryDTO: UpdateCategoryDTO) {
        const userId = req['user']._id
        const category = await this.categoryService.updateCategoryName(categoryId, updateCategoryDTO, userId)
        
        return ResponseHandler(
            HttpStatus.OK,
            'Category Updated',
            category
        )
    }
}
