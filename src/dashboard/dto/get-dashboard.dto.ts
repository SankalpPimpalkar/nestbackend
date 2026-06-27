import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetDashboardQueryDTO {

    @ApiPropertyOptional()
    @IsOptional()
    from?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    to?: Date;
}