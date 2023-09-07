import { Module } from '@nestjs/common';
import { web3Provider } from './web3.provider';

@Module({
    providers: [web3Provider],
    exports: [web3Provider],
})
export class Web3Module {}
