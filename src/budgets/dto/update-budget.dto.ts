import { PartialType } from "@nestjs/mapped-types";
import { CreateBudgetDTO } from "./create-budget.dto";

export class UpdateBudgetDTO extends PartialType(CreateBudgetDTO) { }