import mongoose, { Model } from "mongoose";
import { Income } from "src/incomes/incomes.schema";

export default async function totalIncomeAgreegation(
    incomeModel: Model<Income>,
    userId: mongoose.Types.ObjectId,
    fromDate: Date,
    toDate: Date
) {
    return await incomeModel.aggregate([
        { $match: { user: userId, createdAt: { $gte: fromDate, $lte: toDate } } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        },
        {
            $project: {
                total: 1,
                _id: 0
            }
        }
    ])
}