import { IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose"

export class CreateExpenseDTO {
    @IsString()
    @IsNotEmpty()
    title!: string

    @IsString()
    @IsNotEmpty()
    amount!: number

    @IsString()
    @IsNotEmpty()
    category!: mongoose.Types.ObjectId
}