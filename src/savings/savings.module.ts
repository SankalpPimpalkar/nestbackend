import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, SavingSchema } from './savings.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: Saving.name, schema: SavingSchema },
        ]),
    ],
    providers: [SavingsService],
    controllers: [SavingsController],
})
export class SavingsModule {}
