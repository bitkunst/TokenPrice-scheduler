import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPrice } from './entity/token-price.entity';
import { Repository } from 'typeorm';
import { ITokenPriceData } from './interfaces/token-data.interface';

@Injectable()
export class TokenPriceRepository {
    constructor(
        @InjectRepository(TokenPrice)
        private readonly repository: Repository<TokenPrice>,
    ) {}

    async save(tokenPriceDataArr: ITokenPriceData[]) {
        const result = await this.repository
            .createQueryBuilder('Token-Price')
            .insert()
            .values([...tokenPriceDataArr])
            .execute();

        if (result.raw.affectedRows === 0)
            throw new Error('No rows are inserted');
    }
}
