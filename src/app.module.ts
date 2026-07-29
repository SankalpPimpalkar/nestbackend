import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { IncomesModule } from './incomes/incomes.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DashboardModule } from './dashboard/dashboard.module';
import { SavingsModule } from './savings/savings.module';
import { McpModule } from './mcp/mcp.module';

@Module({
    imports: [
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60000, limit: 10 }],
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string, {
            dbName: 'nestbackend',
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        AuthModule,
        UsersModule,
        CategoriesModule,
        IncomesModule,
        BudgetsModule,
        ExpensesModule,
        DashboardModule,
        SavingsModule,
        McpModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    ],
})
export class AppModule {}
