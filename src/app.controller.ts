import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import ResponseHandler from './utils/ResponseHandler';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
    ) { }

    @Get('')
    getHello() {
        const message = this.appService.getHello();
        return ResponseHandler(HttpStatus.OK, message)
    }
}
