import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import {
    TokenPriceAverageDto,
    TokenPriceDto,
} from './token-price/dto/token-price.dto';

@ApiTags('Token Price Data')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({
        summary: '토큰 가격 정보 조회',
        description: `
        최신의 토큰 정보 조회
        토큰 이름(symbol)으로 최신의 토큰 정보 조회 - 가격 출처가 다수인 경우 각각 출력
        토큰 이름(symbol) + 가격 출처(source)로 최신의 토큰 정보 조회
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
    async getTokenPrice(
        @Query('symbol') symbol: string,
        @Query('source') source: string,
    ) {
        return await this.appService.getTokenData(symbol, source);
    }

    @ApiOperation({
        summary: '토큰 평균 가격 정보 조회',
        description: `
        특정 시간 구간이 주어졌을 때 해당 시간 동안의 평균 가격 조회
        가격 출처가 다수인 경우 각각 출력
        
        startTime, endTime 형식 : YYYY-MM-DD@HH:mm:ss
        `,
    })
    @ApiOkResponse({ type: [TokenPriceAverageDto] })
    @ApiQuery({
        required: true,
        name: 'startTime',
        description: 'Datetime of startTime (YYYY-MM-DD@HH:mm:ss)',
    })
    @ApiQuery({
        required: true,
        name: 'endTime',
        description: 'Datetime of endTime (YYYY-MM-DD@HH:mm:ss)',
    })
    @ApiQuery({
        required: true,
        name: 'tokenSymbol',
        description: 'token symbol',
    })
    @Get('token/average')
    async getAverageTokenPrice(
        @Query('startTime') startTime: string,
        @Query('endTime') endTime: string,
        @Query('tokenSymbol') tokenSymbol: string,
    ) {
        if (!startTime || !endTime || !tokenSymbol)
            throw new BadRequestException('Missing query string');

        return await this.appService.getAverageTokenData(
            startTime,
            endTime,
            tokenSymbol,
        );
    }
}
