import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateBudgetDTO {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 5000,
        required: true
    })
    amount!: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '6a3cc24b01026e1b7222fbe8',
        required: true
    })
    category!: mongoose.Types.ObjectId
}