import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type IncomeDocument = HydratedDocument<Income>;

@Schema({ timestamps: true })
export class Income {
    @Prop({ type: String, required: true })
    source!: string;

    @Prop({ type: Number, required: true })
    amount!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: mongoose.Types.ObjectId
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
