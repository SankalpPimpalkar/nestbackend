import mongoose, { Model } from "mongoose";
import { Expense } from "src/expenses/expenses.schema";

export default async function totalExpenseAgreegation(
    expenseModel: Model<Expense>,
    userId: mongoose.Types.ObjectId,
    fromDate: Date,
    toDate: Date
) {
    return await expenseModel.aggregate([
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