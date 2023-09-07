import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenPriceService } from './token-price/token-price.service';

@Controller()
export class AppController {
    constructor(private readonly tokenPriceService: TokenPriceService) {}

    @Get('bitfinex')
    getBitfinexTokenPrice() {
        return;
    }
}
