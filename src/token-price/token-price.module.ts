import { Module } from '@nestjs/common';
import { TokenPriceService } from './token-price.service';
import { Web3Module } from 'src/web3/web3.module';
import { TokenPriceRepository } from './repository/token-price.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenPrice } from './entity/token-price.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TokenPrice]), Web3Module],
    providers: [TokenPriceService, TokenPriceRepository],
    exports: [TokenPriceService, TokenPriceRepository],
})
export class TokenPriceModule {}
