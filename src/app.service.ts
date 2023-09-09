import { Injectable } from '@nestjs/common';
import { TokenPriceRepository } from './token-price/repository/token-price.repository';

@Injectable()
export class AppService {
    constructor(private readonly tokenPriceRepository: TokenPriceRepository) {}

    async getTokenData(symbol: string, source: string) {
        return await this.tokenPriceRepository.findLatest(symbol, source);
    }
}
