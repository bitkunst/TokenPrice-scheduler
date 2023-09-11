import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenPriceRepository } from './token-price/repository/token-price.repository';

@Injectable()
export class AppService {
    constructor(private readonly tokenPriceRepository: TokenPriceRepository) {}

    async getTokenData(symbol: string, source: string) {
        try {
            return await this.tokenPriceRepository.findLatest(symbol, source);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAverageTokenData(
        startTime: string,
        endTime: string,
        tokenSymbol: string,
    ) {
        try {
            if (!this.isValidDatetimeFormat(startTime, endTime))
                throw new Error('Invalid Datetime format, YYYY-MM-DD@HH:mm:ss');

            return await this.tokenPriceRepository.findAverage(
                startTime,
                endTime,
                tokenSymbol,
            );
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    private isValidDatetimeFormat(startTime: string, endTime: string) {
        const regExp =
            /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])@(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;
        if (!regExp.test(startTime) || !regExp.test(endTime)) return false;
        return true;
    }
}
