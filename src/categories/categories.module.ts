import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './categories.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
        ]),
    ],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService],
})
export class CategoriesModule {}
