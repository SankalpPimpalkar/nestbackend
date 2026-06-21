import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateBudgetDTO {
    @IsNumber()
    @IsNotEmpty()
    amount!: number

    @IsString()
    @IsNotEmpty()
    category!: mongoose.Types.ObjectId
}