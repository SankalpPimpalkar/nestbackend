import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateIncomeDTO {
    @IsString()
    @IsNotEmpty()
    source!: string

    @IsNumber()
    @IsNotEmpty()
    amount!: number
}