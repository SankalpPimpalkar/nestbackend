import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCategoryDTO } from './dto/create-category.dto';
import mongoose from 'mongoose';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoryService: CategoriesService
    ) { }

    @Post('')
    @UseGuards(AuthGuard)
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO, @Req() req: Request) {
        const userId = req['user']._id
        const category = await this.categoryService.createCategory(createCategoryDTO, userId)
        return {
            data: {
                _id: category._id,
                name: category.name
            }
        }
    }

    @Get('')
    @UseGuards(AuthGuard)
    async getAllUserCategories(@Req() req: Request) {
        const userId = req['user']._id
        const categories = await this.categoryService.getAllUserCategories(userId)
        return {
            data: categories
        }
    }

    @Delete(':categoryId')
    @UseGuards(AuthGuard)
    async deleteCategory(@Param('categoryId') categoryId: mongoose.Types.ObjectId, @Req() req: Request) {
        const userId = req['user']._id
        const deletedCategory = await this.categoryService.deleteCategory(categoryId, userId)
        return {
            data: {
                _id: deletedCategory._id,
                name: deletedCategory.name
            }
        }
    }

    @Patch(':categoryId')
    @UseGuards(AuthGuard)
    async updateCategory(
        @Param('categoryId') categoryId: mongoose.Types.ObjectId,
        @Req() req: Request,
        @Body() updateCategoryDTO: UpdateCategoryDTO) {
        const userId = req['user']._id
        const category = await this.categoryService.updateCategoryName(categoryId, updateCategoryDTO, userId)
        return {
            data: {
                _id: category._id,
                name: category.name
            }
        }
    }
}
