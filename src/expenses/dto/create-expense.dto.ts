import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import mongoose from "mongoose"

export class CreateExpenseDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title!: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    amount!: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    category!: mongoose.Types.ObjectId
}