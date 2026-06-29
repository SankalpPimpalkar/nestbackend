import mongoose, { Model } from 'mongoose';
import { Budget } from 'src/budgets/budgets.schema';

export default async function remainingBudgetAgreegation(
    budgetModel: Model<Budget>,
    userId: mongoose.Types.ObjectId,
    fromDate: Date,
    toDate: Date,
) {
    return await budgetModel.aggregate([
        { $match: { user: userId } },
        {
            $lookup: {
                from: 'expenses',
                let: {
                    category: '$category',
                    user: '$user',
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$category', '$$category'] },
                                    { $eq: ['$user', '$$user'] },
                                    { $gte: ['$createdAt', fromDate] },
                                    { $lte: ['$createdAt', toDate] },
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
                    {
                        $project: {
                            _id: 0,
                            totalExpense: 1,
                        },
                    },
                ],
                as: 'expenses',
            },
        },
        {
            $addFields: {
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
                remainingBudget: {
                    $subtract: ['$amount', '$totalExpense'],
                },
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
            },
        },
        {
            $unwind: '$category',
        },
        {
            $project: {
                _id: 0,
                category: {
                    _id: '$category._id',
                    name: '$category.name',
                },
                totalExpense: 1,
                totalBudget: '$amount',
                remainingBudget: 1,
            },
        },
    ]);
}
