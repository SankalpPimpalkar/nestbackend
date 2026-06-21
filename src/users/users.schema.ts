import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    fname!: string;
    
    @Prop()
    lname!: string;
    
    @Prop()
    email!: string;
    
    @Prop()
    password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
