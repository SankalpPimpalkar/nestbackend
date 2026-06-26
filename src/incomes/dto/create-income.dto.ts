import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateIncomeDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Salary',
        required: true
    })
    source!: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 40000,
        required: true
    })
    amount!: number
}