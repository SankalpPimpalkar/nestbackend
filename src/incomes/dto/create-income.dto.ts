import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateIncomeDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    source!: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    amount!: number
}