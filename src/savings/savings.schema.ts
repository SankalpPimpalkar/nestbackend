import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SavingDocument = HydratedDocument<Saving>;

@Schema({ timestamps: true })
export class Saving {
    @Prop({ type: String, required: true })
    title!: string;

    @Prop({ type: Number, default: 0 })
    initialSavings!: number;

    @Prop({ type: Number, required: true })
    goal!: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: mongoose.Types.ObjectId;
}

export const SavingSchema = SchemaFactory.createForClass(Saving);
