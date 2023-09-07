import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './config/typeOrmConfigService';
import { TokenPriceModule } from './token-price/token-price.module';
import { Web3Module } from './web3/web3.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        ScheduleModule.forRoot(),
        TokenPriceModule,
        Web3Module,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
