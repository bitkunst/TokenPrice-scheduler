import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenPriceService } from './token-price/token-price.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly tokenPriceService: TokenPriceService) {}

    @ApiOperation({ summary: '토큰 정보 조회' })
    @ApiQuery({
        required: false,
        name: 'symbol',
        description: 'token symbol',
    })
    @ApiQuery({
        required: false,
        name: 'source',
        description: 'token data source',
    })
    @Get('token')
    getTokenPrice(
        @Query('symbol') symbol: string,
        @Query('source') source: string,
    ) {
        return;
    }
}
