import { Injectable, Logger } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { LoginTool } from './tools/auth/login.tool';
import { CreateExpenseTool } from './tools/expenses/create-expense.tool';
import { GetExpensesTool } from './tools/expenses/get-expenses.tool';
import { CreateCategoryTool } from './tools/categories/create-category.tool';
import { GetCategoriesTool } from './tools/categories/get-categories.tool';

@Injectable()
export class McpService {
    private readonly logger = new Logger(McpService.name);
    private readonly server: McpServer;

    constructor(
        private readonly loginTool: LoginTool,
        private readonly createExpenseTool: CreateExpenseTool,
        private readonly getExpensesTool: GetExpensesTool,
        private readonly createCategoryTool: CreateCategoryTool,
        private readonly getCategoriesTool: GetCategoriesTool,
    ) {
        this.server = new McpServer({
            name: 'expense-tracker',
            version: '1.0.0',
        });

        this.registerTools();
        this.logger.log('MCP Server initialized');
    }

    private registerTools() {
        this.loginTool.register(this.server);
        this.createExpenseTool.register(this.server);
        this.getExpensesTool.register(this.server);
        this.createCategoryTool.register(this.server);
        this.getCategoriesTool.register(this.server);

        this.logger.log('All MCP tools registered');
    }

    getServer() {
        return this.server;
    }
}
