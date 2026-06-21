import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './categories.schema';
import mongoose, { Model } from 'mongoose';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

    async createCategory(createCategoryDTO: CreateCategoryDTO, userId: string) {
        const existingCategory = await this.categoryModel.findOne({
            name: createCategoryDTO.name,
            user: userId
        })

        if (existingCategory) {
            throw new ConflictException(`Category ${existingCategory.name} already exists`)
        }

        const newCategory = await this.categoryModel
            .create(createCategoryDTO)
        return newCategory.toObject()
    }

    async getAllUserCategories(userId: mongoose.Types.ObjectId) {
        const categories = await this.categoryModel
            .find({ user: userId })
            .select('-user -__v')
            .lean()
        return categories
    }

    async deleteCategory(categoryId: mongoose.Types.ObjectId, userId: string) {
        const category = await this.categoryModel
            .findOneAndDelete({ user: userId, _id: categoryId })
            .select('-user -__v')
            .lean()

        if (!category) {
            throw new ConflictException('Category does not exist')
        }

        return category
    }

    async updateCategoryName(categoryId: mongoose.Types.ObjectId, updateCategoryDTO: UpdateCategoryDTO, userId: mongoose.Types.ObjectId) {
        const category = await this.categoryModel
            .findOneAndUpdate({ _id: categoryId, user: userId }, updateCategoryDTO)
            .select('-user -__v')
            .lean()

        if (!category) {
            throw new ConflictException('Category does not exist')
        }

        return category
    }
}
