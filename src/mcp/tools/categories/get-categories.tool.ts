import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable } from '@nestjs/common';
import { ExpensesService } from 'src/expenses/expenses.service';
import { SessionService } from 'src/mcp/sessions/session.service';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class GetCategoriesTool {
    constructor(
        private readonly sessionService: SessionService,
        private readonly categoryService: CategoriesService,
    ) {}

    register(mcp: McpServer) {
        mcp.registerTool(
            'get-categories',
            {
                title: 'Get Categories',
                description: 'Returns all categories of the logged in user.',
                inputSchema: {},
            },
            async () => {
                const session = this.sessionService.getSession();

                if (!session) {
                    throw new Error('Please login first.');
                }

                const categories =
                    await this.categoryService.getAllUserCategories(
                        new mongoose.Types.ObjectId(session.userId),
                    );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(categories),
                        },
                    ],
                };
            },
        );
    }
}
