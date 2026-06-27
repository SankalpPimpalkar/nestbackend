import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({ timestamps: true })
export class Budget {
    @Prop({ type: Number, required: true })
    amount!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: mongoose.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    category!: mongoose.Types.ObjectId
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
BudgetSchema.index({ user: 1, category: 1 }, { unique: true })