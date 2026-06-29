import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSavingDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'House',
        required: true,
    })
    title!: string;

    @IsNumber()
    @ApiProperty({
        example: 150,
        required: true,
    })
    initialSavings: number = 0;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: 150,
        required: true,
    })
    goal!: number;
}
