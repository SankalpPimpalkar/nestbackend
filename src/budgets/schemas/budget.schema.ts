
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({ timestamps: true })
export class Budget {
    @Prop({ type: Number, required: true, min: 0 })
    amount!: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true })
    category!: Types.ObjectId
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
