import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TokenPriceDto } from './token-price/dto/token-price.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({
        summary: '토큰 가격 정보 조회',
        description: `
        symbol 과 source 가 없으면 모든 토큰의 최신 정보 조회
        symbol만 있으면 토큰 이름으로 최신 정보 조회
        symbol + source 로 해당하는 토큰의 최신 정보 조회
        `,
    })
    @ApiOkResponse({ type: [TokenPriceDto] })
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
        return this.appService.getTokenData(symbol, source);
    }
}
