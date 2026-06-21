import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Income, IncomeSchema } from './incomes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Income.name, schema: IncomeSchema }])],
  controllers: [IncomesController],
  providers: [IncomesService]
})
export class IncomesModule { }
