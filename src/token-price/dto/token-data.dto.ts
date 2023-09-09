import { PickType } from '@nestjs/swagger';
import { TokenPrice } from '../entity/token-price.entity';

export class TokenPriceDto extends PickType(TokenPrice, [
    'token_symbol',
    'token_price',
    'price_source',
] as const) {}
