import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import Web3 from 'web3';
import {
    IBitfinexResponse,
    ITokenData,
    ITokenPrice,
} from './interfaces/token-price.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenPriceRepository } from './repository/token-price.repository';
import {
    BITFINEX_API_URL,
    BITFINEX_TOKEN_DATA,
    BSC_WEB3,
    CHAINLINK_PRICE_FEED_DATA,
    SOURCE_BITFINEX,
    SOURCE_CHAINLINK,
} from 'src/constants/web3.constants';
import { BigNumber } from 'bignumber.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TokenPriceService {
    private readonly logger = new Logger(TokenPriceService.name);

    constructor(
        @Inject(BSC_WEB3) private readonly bscWeb3: Web3,
        private readonly tokenPriceRepository: TokenPriceRepository,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async setTokenPrices() {
        try {
            const tokenPriceResults = await this.fetchTokenPrices();
            for await (const result of tokenPriceResults) {
                if (result.status === 'fulfilled') {
                    await this.tokenPriceRepository.save(result.value);
                }
            }
        } catch (error) {
            this.logger.error(
                'Failed to fetch and save token prices',
                error.stack,
            );
        }
    }

    private async fetchTokenPrices() {
        const results = await Promise.allSettled([
            this.fetchBitfinexPrices(),
            this.fetchChainlinkPrices(),
        ]);

        return results;
    }

    private async fetchChainlinkPrices() {
        const tokenDataArr = await this.getChainlinkTokenData();
        return this.formatChainlinkTokenData(tokenDataArr);
    }

    private formatChainlinkTokenData(
        tokenDataArr: PromiseSettledResult<ITokenData>[],
    ): ITokenPrice[] {
        return tokenDataArr.reduce((acc, v) => {
            if (v.status === 'fulfilled') {
                acc.push({
                    token_symbol: v.value.symbol,
                    token_pair: v.value.pair,
                    token_price: v.value.price,
                    price_source: SOURCE_CHAINLINK,
                    timestamp: v.value.timestamp,
                });
            }
            return acc;
        }, []);
    }

    private async getChainlinkTokenData() {
        const keys = Object.keys(CHAINLINK_PRICE_FEED_DATA);
        const requests = keys.map(async (token) => {
            const contract = this.getChainlinkContractInstance(
                CHAINLINK_PRICE_FEED_DATA[token].address,
            );
            const { answer }: { answer: bigint } = await contract.methods
                .latestRoundData()
                .call();
            const timestamp = new Date().toISOString();
            const decimals: bigint = await contract.methods.decimals().call();
            const price = new BigNumber(answer.toString())
                .dividedBy(new BigNumber(10).pow(decimals.toString()))
                .toString();

            return {
                symbol: CHAINLINK_PRICE_FEED_DATA[token].symbol,
                pair: CHAINLINK_PRICE_FEED_DATA[token].pair,
                price,
                timestamp,
            };
        });

        const responses = await Promise.allSettled(requests);
        return responses;
    }

    private getChainlinkContractInstance(address: string) {
        const filePath = path.resolve(__dirname, '../abi/ChainLink.json');
        const contract_abi = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return new this.bscWeb3.eth.Contract(contract_abi, address);
    }

    private async fetchBitfinexPrices() {
        const tokenDataArr = await this.getBitfinexTokenData();
        return this.formatBitfinexTokenData(tokenDataArr);
    }

    private formatBitfinexTokenData(
        tokenDataArr: PromiseSettledResult<ITokenData>[],
    ): ITokenPrice[] {
        return tokenDataArr.reduce((acc, v) => {
            if (v.status === 'fulfilled') {
                acc.push({
                    token_symbol: v.value.symbol,
                    token_pair: v.value.pair,
                    token_price: v.value.price,
                    price_source: SOURCE_BITFINEX,
                    timestamp: v.value.timestamp,
                });
            }
            return acc;
        }, []);
    }

    private async getBitfinexTokenData(): Promise<
        PromiseSettledResult<ITokenData>[]
    > {
        const keys = Object.keys(BITFINEX_TOKEN_DATA);
        const requests = keys.map(async (token) => {
            const { data } = await axios.get<IBitfinexResponse>(
                this.getBitfinexApiUrl(BITFINEX_TOKEN_DATA[token].params),
            );
            return {
                symbol: BITFINEX_TOKEN_DATA[token].symbol,
                pair: BITFINEX_TOKEN_DATA[token].pair,
                price: data.last_price,
                timestamp: new Date().toISOString(),
            };
        });
        const responses = await Promise.allSettled(requests);
        return responses;
    }

    private getBitfinexApiUrl(symbol: string): string {
        return BITFINEX_API_URL + symbol;
    }
}
