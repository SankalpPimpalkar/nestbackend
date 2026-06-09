import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    fname!: string

    @IsString()
    @IsNotEmpty()
    lname!: string

    @IsString()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string
}