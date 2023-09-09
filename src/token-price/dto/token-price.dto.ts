import { ApiProperty, PickType } from '@nestjs/swagger';
import { TokenPrice } from '../entity/token-price.entity';

export class TokenPriceDto extends PickType(TokenPrice, [
    'token_symbol',
    'token_pair',
    'token_price',
    'price_source',
    'timestamp',
] as const) {
    @ApiProperty({ description: 'token symbol', example: 'BTC' })
    token_symbol: string;

    @ApiProperty({ description: 'token pair', example: 'BTC/USD' })
    token_pair: string;

    @ApiProperty({
        description: 'token pair에 해당하는 가격',
        example: '25852.0',
    })
    token_price: string;

    @ApiProperty({ description: 'token price 출처', example: 'Bitfinex' })
    price_source: string;

    @ApiProperty({ description: '타임스탬프', example: '2023-09-09 22:31:00' })
    timestamp: Date;
}
