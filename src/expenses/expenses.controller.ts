import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('expenses')
export class ExpensesController {
    constructor(
        private readonly configService: ConfigService
    ) { }

    @Get()
    anything(){
        console.log(this.configService.get('MONGO_URI'))
        return "Anything"
    }
}
