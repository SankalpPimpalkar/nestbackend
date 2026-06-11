import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsNotEmpty()
    fname!: string

    @IsString()
    @IsNotEmpty()
    lname!: string

    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsString()
    @IsNotEmpty()
    password!: string
}