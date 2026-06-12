
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, required: true })
    name!: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user!: User
}

export const CategorySchema = SchemaFactory.createForClass(Category);
