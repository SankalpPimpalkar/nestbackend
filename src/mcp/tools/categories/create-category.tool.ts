import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Injectable } from '@nestjs/common';
import { SessionService } from 'src/mcp/sessions/session.service';
import mongoose from 'mongoose';
import { z } from 'zod';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class CreateCategoryTool {
    constructor(
        private readonly sessionService: SessionService,
        private readonly categoryService: CategoriesService,
    ) {}

    register(mcp: McpServer) {
        mcp.registerTool(
            'create-category',
            {
                title: 'Create Category',
                inputSchema: {
                    name: z.string(),
                },
            },
            async ({ name }) => {
                const session = this.sessionService.getSession();

                if (!session) {
                    throw new Error('Please login first.');
                }

                const category = await this.categoryService.createCategory(
                    {
                        name,
                    },
                    new mongoose.Types.ObjectId(session.userId),
                );

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(category),
                        },
                    ],
                };
            },
        );
    }
}
