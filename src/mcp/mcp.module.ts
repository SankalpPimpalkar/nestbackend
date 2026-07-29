import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { AuthModule } from 'src/auth/auth.module';
import { SessionService } from './sessions/session.service';
import { LoginTool } from './tools/auth/login.tool';
import { CreateExpenseTool } from './tools/expenses/create-expense.tool';
import { GetExpensesTool } from './tools/expenses/get-expenses.tool';
import { CreateCategoryTool } from './tools/categories/create-category.tool';
import { GetCategoriesTool } from './tools/categories/get-categories.tool';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { McpController } from './mcp.controller';

@Module({
    imports: [AuthModule, ExpensesModule, CategoriesModule],
    providers: [
        McpService,
        SessionService,

        LoginTool,
        CreateExpenseTool,
        GetExpensesTool,
        CreateCategoryTool,
        GetCategoriesTool,
    ],
    exports: [McpService],
    controllers: [McpController],
})
export class McpModule {}
