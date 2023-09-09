import { Module } from '@nestjs/common';
import { bscWeb3Provider } from './web3.provider';

@Module({
    providers: [bscWeb3Provider],
    exports: [bscWeb3Provider],
})
export class Web3Module {}
