import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

export class GetExpensesQueryDTO extends PartialType(PaginationDTO) {
    @ApiPropertyOptional()
    @IsOptional()
    category?: string;
}