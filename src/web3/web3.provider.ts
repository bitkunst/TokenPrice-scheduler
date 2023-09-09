import { Provider } from '@nestjs/common';
import { BSC_TESTNET_RPC_URL, BSC_WEB3 } from 'src/constants/web3.constants';
import Web3 from 'web3';

export const bscWeb3Provider: Provider = {
    provide: BSC_WEB3,
    useFactory: (): Web3 => {
        return new Web3(new Web3.providers.HttpProvider(BSC_TESTNET_RPC_URL));
    },
};
