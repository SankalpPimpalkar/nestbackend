import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { SessionService } from 'src/mcp/sessions/session.service';
import mongoose from 'mongoose';
import { z } from 'zod';

@Injectable()
export class GetExpensesTool {
    constructor(
        private readonly sessionService: SessionService,
        private readonly expenseService: ExpensesService,
    ) {}

    register(mcp: McpServer) {
        mcp.registerTool(
            'get-expenses',
            {
                title: 'Get Expenses',
                description:
                    'Returns expenses for the currently logged in user.',
                inputSchema: {
                    page: z.number().int().positive().default(1),
                    limit: z.number().int().positive().default(10),
                    search: z.string().optional(),
                    category: z.string().optional(),
                    from: z.string().datetime().optional(),
                    to: z.string().datetime().optional(),
                },
            },
            async ({ page, limit, search, category, from, to }) => {
                const session = this.sessionService.getSession();

                if (!session) {
                    throw new Error('Please login first.');
                }

                const expenses = await this.expenseService.getAllExpenses(
                    new mongoose.Types.ObjectId(session.userId),
                    page,
                    limit,
                    category,
                    search,
                    from ? new Date(from) : undefined,
                    to ? new Date(to) : undefined,
                );

                if (!expenses.length) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: 'No expenses found.',
                            },
                        ],
                    };
                }

                const text = expenses
                    .map(
                        (expense, index) =>
                            `${index + 1}. ${expense.title}
                            Amount: ₹${expense.amount}
                            Category: ${expense.categoryName}`,
                    )
                    .join('\n\n');

                return {
                    content: [
                        {
                            type: 'text',
                            text,
                        },
                    ],
                };
            },
        );
    }
}
