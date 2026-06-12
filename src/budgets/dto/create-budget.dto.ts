import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator"

export class CreateBudgetDTO {
    @IsNumber()
    @Min(0)
    amount!: number

    @IsMongoId()
    @IsNotEmpty()
    category!: string
}