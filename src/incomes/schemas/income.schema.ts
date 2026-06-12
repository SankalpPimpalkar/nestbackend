
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type IncomeDocument = HydratedDocument<Income>;

@Schema({ timestamps: true })
export class Income {
    @Prop({ type: Number, required: true, min: 0 })
    amount!: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: User
}

export const IncomeSchema = SchemaFactory.createForClass(Income);
