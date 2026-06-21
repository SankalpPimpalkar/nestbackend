import { IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateCategoryDTO {
    @IsString()
    @IsNotEmpty()
    name!: string
}