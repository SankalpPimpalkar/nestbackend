import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fname!: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lname!: string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email!: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password!: string
}