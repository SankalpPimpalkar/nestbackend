import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/auth/auth.guard';
import ResponseHandler from 'src/utils/ResponseHandler';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly dashboardService: DashboardService
    ) { }

    @Get('')
    @UseGuards(AuthGuard)
    async getDashboardData(@Req() req: Request,) {
        const userId = req['user']._id
        const res = await this.dashboardService.getDashboardData(userId)
        return ResponseHandler(HttpStatus.OK, 'Fetched Dashboard Data', res)
    }
}
