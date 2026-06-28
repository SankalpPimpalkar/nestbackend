
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDTO {
    @ApiPropertyOptional()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    from?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    to?: Date;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}