import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from './savings.schema';
import mongoose, { Model } from 'mongoose';
import { CreateSavingDTO } from './dto/create-saving.dto';
import { UpdateSavingDTO } from './dto/update-saving.dto';

@Injectable()
export class SavingsService {
    constructor(@InjectModel(Saving.name) private savingModel: Model<Saving>) {}

    async createSaving(
        userId: mongoose.Types.ObjectId,
        createSavingDTO: CreateSavingDTO,
    ) {
        const newSaving = await this.savingModel.create({
            user: userId,
            ...createSavingDTO,
            initialSavings: Number(createSavingDTO.initialSavings) || 0,
        });

        if (!newSaving) {
            throw new ConflictException('Failed to add Saving');
        }

        return newSaving.toObject();
    }

    async getAllSavings(userId: mongoose.Types.ObjectId) {
        const savings = await this.savingModel.aggregate([
            { $match: { user: userId } },
            {
                $lookup: {
                    from: 'incomes',
                    let: { user: '$user', rootDate: '$createdAt' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$user'] },
                                        { $gte: ['$createdAt', '$$rootDate'] },
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalIncome: {
                                    $sum: '$amount',
                                },
                            },
                        },
                    ],
                    as: 'incomes',
                },
            },
            {
                $lookup: {
                    from: 'expenses',
                    let: { user: '$user', rootDate: '$createdAt' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$user'] },
                                        { $gte: ['$createdAt', '$$rootDate'] },
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalExpense: {
                                    $sum: '$amount',
                                },
                            },
                        },
                    ],
                    as: 'expenses',
                },
            },
            {
                $project: {
                    title: 1,
                    initialSavings: 1,
                    goal: 1,
                    totalIncome: {
                        $ifNull: [
                            { $arrayElemAt: ['$incomes.totalIncome', 0] },
                            0,
                        ],
                    },
                    totalExpense: {
                        $ifNull: [
                            { $arrayElemAt: ['$expenses.totalExpense', 0] },
                            0,
                        ],
                    },
                },
            },
            {
                $addFields: {
                    totalSavings: {
                        $add: [
                            { $subtract: ['$totalIncome', '$totalExpense'] },
                            '$initialSavings',
                        ],
                    },
                },
            },
            {
                $addFields: {
                    progress: {
                        $cond: {
                            if: { $eq: ['$goal', 0] },
                            then: 0,
                            else: {
                                $max: [
                                    0,
                                    {
                                        $min: [
                                            100,
                                            {
                                                $multiply: [
                                                    {
                                                        $divide: [
                                                            '$totalSavings',
                                                            '$goal',
                                                        ],
                                                    },
                                                    100,
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    progress: -1,
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    initialSavings: 1,
                    goal: 1,
                    totalSavings: 1,
                    progress: {
                        $trunc: ['$progress', 2],
                    },
                },
            },
        ]);
        return savings;
    }

    async updateSaving(
        userId: mongoose.Types.ObjectId,
        savingsId: mongoose.Types.ObjectId,
        updateSavingDTO: UpdateSavingDTO,
    ) {
        const updatedSaving = await this.savingModel.findOneAndUpdate(
            {
                _id: savingsId,
                user: userId,
            },
            updateSavingDTO,
            { returnDocument: 'after' },
        );

        if (!updateSavingDTO) {
            throw new NotFoundException('Saving not found');
        }

        return updatedSaving;
    }

    async deleteSaving(
        userId: mongoose.Types.ObjectId,
        savingsId: mongoose.Types.ObjectId,
    ) {
        const deletedSaving = await this.savingModel.findOneAndDelete({
            _id: savingsId,
            user: userId,
        });

        if (!deletedSaving) {
            throw new NotFoundException('Saving not found');
        }

        return deletedSaving;
    }
}
