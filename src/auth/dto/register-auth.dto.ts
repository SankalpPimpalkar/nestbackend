import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    fname!: string;

    @IsString()
    @IsNotEmpty()
    lname!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password!: string;
}
