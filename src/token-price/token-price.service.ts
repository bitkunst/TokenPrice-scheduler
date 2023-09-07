import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { WEB3 } from 'src/web3/web3.provider';
import Web3 from 'web3';
import {
    IBitfinexResponse,
    IBitfinexTokenData,
    ITokenPriceData,
} from './interfaces/token-data.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenPriceRepository } from './token-price.repository';

@Injectable()
export class TokenPriceService {
    private readonly logger = new Logger(TokenPriceService.name);

    constructor(
        @Inject(WEB3) private readonly web3: Web3,
        private readonly tokenPriceRepository: TokenPriceRepository,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async setTokenPrices() {
        try {
            const bitfinexPrices = await this.fetchBitfinexPrices();
            this.logger.log('Bitfinex prices', bitfinexPrices);

            await this.tokenPriceRepository.save(bitfinexPrices);
        } catch (error) {
            this.logger.error(
                'Failed to fetch and save bitfinex prices',
                error.stack,
            );
        }
    }

    private async fetchBitfinexPrices() {
        const symbols = this.bitfinexTokenSymbols();
        const tokenDataArr = await this.getBitfinexTokenData(symbols);
        return this.formatBitfinexTokenData(tokenDataArr);
    }

    private formatBitfinexTokenData(
        tokenDataArr: PromiseSettledResult<IBitfinexTokenData>[],
    ): ITokenPriceData[] {
        return tokenDataArr.reduce((acc, v) => {
            if (v.status === 'fulfilled') {
                acc.push({
                    token_symbol: v.value.symbol,
                    token_price: v.value.data.last_price,
                    price_source: 'Bitfinex',
                    timestamp: new Date(
                        parseFloat(v.value.data.timestamp) * 1000,
                    ),
                });
            }
            return acc;
        }, []);
    }

    private async getBitfinexTokenData(
        symbols: string[],
    ): Promise<PromiseSettledResult<IBitfinexTokenData>[]> {
        const requests = symbols.map(async (symbol) => {
            const { data } = await axios.get<IBitfinexResponse>(
                this.getBitfinexApiUrl(symbol),
            );
            return { symbol, data };
        });
        const responses = await Promise.allSettled(requests);
        return responses;
    }

    private getBitfinexApiUrl(symbol: string): string {
        return 'https://api.bitfinex.com/v1/pubticker/' + symbol;
    }

    private bitfinexTokenSymbols(): string[] {
        return ['USTUSD', 'UDCUSD', 'ETHUSD', 'BTCUSD'];
    }
}
