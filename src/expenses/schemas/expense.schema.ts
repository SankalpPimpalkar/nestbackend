
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Category } from './category.schema';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema()
export class Expense {
    @Prop({ type: String, required: true })
    title!: string

    @Prop({ type: Number, required: true, min: 0 })
    amount!: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    category!: Category
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
