import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'sankalp.pimpalkar@gmail.com',
        required: true,
    })
    email!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: '1234578910',
        required: true,
    })
    password!: string;
}
