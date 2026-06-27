import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Budget } from 'src/budgets/budgets.schema';
import { Category } from 'src/categories/categories.schema';
import { Expense } from 'src/expenses/expenses.schema';
import { Income } from 'src/incomes/incomes.schema';
import { User } from 'src/users/users.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Budget.name) private budgetModel: Model<Budget>,
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @InjectModel(Expense.name) private expenseModel: Model<Expense>,
        @InjectModel(Income.name) private incomeModel: Model<Income>,
    ) { }

    async getDashboardData(userId: mongoose.Types.ObjectId, from?: Date, to?: Date) {
        const now = new Date()
        const fromDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1)
        const toDate = to ? new Date(to) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

        const totalIncomeFn = async () => await this.incomeModel.aggregate([
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
        const totalExpenseFn = async () => await this.expenseModel.aggregate([
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
        const budgetConsumptionsFn = async () => await this.budgetModel.aggregate([
            { $match: { user: userId } },
            {
                $lookup: {
                    from: 'expenses',
                    let: {
                        category: "$category",
                        user: "$user"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$category", "$$category"] },
                                        { $eq: ["$user", "$$user"] },
                                        { $gte: ["$createdAt", fromDate] },
                                        { $lte: ["$createdAt", toDate] }
                                    ]
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                totalExpense: {
                                    $sum: "$amount"
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalExpense: 1
                            }
                        }
                    ],
                    as: "expenses"
                }
            },
            {
                $addFields: {
                    totalExpense: {
                        $ifNull: [{ $arrayElemAt: ["$expenses.totalExpense", 0] }, 0]
                    }
                }
            },
            {
                $addFields: {
                    remainingBudget: {
                        $subtract: ["$amount", "$totalExpense"]
                    }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: 0,
                    category: {
                        _id: "$category._id",
                        name: "$category.name"
                    },
                    totalExpense: 1,
                    totalBudget: "$amount",
                    remainingBudget: 1,
                }
            }
        ])
        const topSpendingCategoriesFn = async () => await this.expenseModel.aggregate([
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

        const [
            totalIncome,
            totalExpense,
            budgetConsumptions,
            topSpendingCategories
        ] = await Promise.all([
            totalIncomeFn(),
            totalExpenseFn(),
            budgetConsumptionsFn(),
            topSpendingCategoriesFn()
        ])

        return {
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            budgetConsumptions: budgetConsumptions,
            remainingBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            topSpendingCategories
        }
    }
}
