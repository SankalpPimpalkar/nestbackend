import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { SessionService } from 'src/mcp/sessions/session.service';
import mongoose from 'mongoose';
import { z } from 'zod';

@Injectable()
export class CreateExpenseTool {
    constructor(
        private readonly sessionService: SessionService,
        private readonly expenseService: ExpensesService,
    ) {}

    register(mcp: McpServer) {
        mcp.registerTool(
            'create-expense',
            {
                title: 'Create Expense',
                description: 'Creates an expense for the logged in user.',
                inputSchema: {
                    title: z.string().min(1),
                    amount: z.number().positive(),
                    categoryId: z.string(),
                },
            },
            async ({ title, amount, categoryId }) => {
                const session = this.sessionService.getSession();

                if (!session) {
                    throw new Error('Please login first.');
                }

                const expense = await this.expenseService.createExpense(
                    {
                        title,
                        amount,
                        category: new mongoose.Types.ObjectId(categoryId),
                    },
                    new mongoose.Types.ObjectId(session.userId),
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: `Expense "${expense.title}" created successfully.`,
                        },
                    ],
                };
            },
        );
    }
}
