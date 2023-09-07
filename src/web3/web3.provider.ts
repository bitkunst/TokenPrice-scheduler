import { Provider } from '@nestjs/common';
import Web3 from 'web3';

export const WEB3 = 'WEB3';

export const web3Provider: Provider = {
    provide: WEB3,
    useFactory: (): Web3 => {
        return new Web3();
    },
};
