import mongoose, { Model } from "mongoose";
import { Expense } from "src/expenses/expenses.schema";

export default async function topSpendingCategoriesAgreegation(
    expenseModel: Model<Expense>,
    userId: mongoose.Types.ObjectId,
) {
    return await expenseModel.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: "$category" },
            {
                $sort: {
                    total: -1
                }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 0,
                    category: {
                        _id: "$category._id",
                        name: "$category.name",
                    },
                    total: 1
                }
            }
        ])
}