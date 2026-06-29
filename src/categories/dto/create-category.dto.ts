import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Food',
        required: true,
    })
    name!: string;
}
