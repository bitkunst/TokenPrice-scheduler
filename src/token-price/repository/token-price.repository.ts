import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPrice } from '../entity/token-price.entity';
import { Repository } from 'typeorm';
import { ITokenPrice } from '../interfaces/token-price.interface';

@Injectable()
export class TokenPriceRepository {
    private readonly logger = new Logger(TokenPriceRepository.name);

    constructor(
        @InjectRepository(TokenPrice)
        private readonly repository: Repository<TokenPrice>,
    ) {}

    async save(tokenPriceDataArr: ITokenPrice[]) {
        const result = await this.repository
            .createQueryBuilder('Token_Price')
            .insert()
            .values([...tokenPriceDataArr])
            .execute();

        if (result.raw.affectedRows === 0)
            throw new Error('No rows are inserted!');
        else this.logger.log(`Token data inserted!`);
    }

    async findLatest(symbol?: string, source?: string) {
        let subQuery = this.repository
            .createQueryBuilder()
            .select([
                'token_symbol',
                'price_source',
                'MAX(timestamp) AS max_timestamp',
            ]);

        if (symbol && source) {
            subQuery = subQuery
                .where('token_symbol = :symbol', { symbol })
                .andWhere('price_source = :source', { source });
        } else if (symbol) {
            subQuery = subQuery.where('token_symbol = :symbol', { symbol });
        } else if (source) {
            subQuery = subQuery.where('price_source = :source', { source });
        }
        subQuery.groupBy('token_symbol').addGroupBy('price_source');

        const mainQuery = this.repository
            .createQueryBuilder('tp')
            .select([
                'tp.token_symbol AS token_symbol',
                'tp.token_pair AS token_pair',
                'tp.token_price AS token_price',
                'tp.price_source AS price_source',
                'DATE_FORMAT(tp.timestamp, "%Y-%m-%d %H:%i:%s") AS timestamp',
            ])
            .innerJoin(
                `(${subQuery.getQuery()})`,
                'latest',
                'tp.token_symbol = latest.token_symbol AND tp.price_source = latest.price_source AND tp.timestamp = latest.max_timestamp',
            )
            .setParameters(subQuery.getParameters())
            .orderBy('tp.token_symbol');
        const result = await mainQuery.getRawMany();

        return result;
    }

    async findAverage(startTime: string, endTime: string, tokenSymbol: string) {
        const result = await this.repository
            .createQueryBuilder()
            .select([
                'token_symbol',
                'token_pair',
                'price_source',
                'AVG(token_price) AS average_price',
            ])
            .where('token_symbol = :tokenSymbol', { tokenSymbol })
            .andWhere('timestamp BETWEEN :startTime AND :endTime', {
                startTime,
                endTime,
            })
            .groupBy('token_symbol')
            .addGroupBy('token_pair')
            .addGroupBy('price_source')
            .getRawMany();

        return result;
    }
}
