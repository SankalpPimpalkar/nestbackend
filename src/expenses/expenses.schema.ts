import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true })
export class Expense {
    @Prop({ type: String, required: true })
    title!: string;

    @Prop({ type: Number, required: true })
    amount!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    category!: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: mongoose.Types.ObjectId
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
