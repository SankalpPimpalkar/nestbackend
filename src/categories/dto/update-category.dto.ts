import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDTO } from "./create-category.dto";
import { IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}