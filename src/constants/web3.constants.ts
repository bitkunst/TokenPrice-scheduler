// Bitfinex API
export const SOURCE_BITFINEX = 'Bitfinex';
export const BITFINEX_API_URL = 'https://api.bitfinex.com/v1/pubticker/';
export const BITFINEX_TOKEN_DATA = {
    USDT_USD: {
        symbol: 'USDT',
        pair: 'USDT/USD',
        params: 'USTUSD',
    },
    USDC_USD: {
        symbol: 'USDC',
        pair: 'USDC/USD',
        params: 'UDCUSD',
    },
    ETH_USD: {
        symbol: 'ETH',
        pair: 'ETH/USD',
        params: 'ETHUSD',
    },
    BTC_USD: {
        symbol: 'BTC',
        pair: 'BTC/USD',
        params: 'BTCUSD',
    },
};

// BSC Testnet
export const BSC_WEB3 = 'BSC_WEB3';
export const BSC_TESTNET_RPC_URL =
    'https://data-seed-prebsc-1-s1.binance.org:8545/';

// Chainlink
export const SOURCE_CHAINLINK = 'Chainlink';
export const CHAINLINK_PRICE_FEED_DATA = {
    DAI_USD: {
        symbol: 'DAI',
        pair: 'DAI/USD',
        address: '0xE4eE17114774713d2De0eC0f035d4F7665fc025D',
    },
    USDT_USD: {
        symbol: 'USDT',
        pair: 'USDT/USD',
        address: '0xEca2605f0BCF2BA5966372C99837b1F182d3D620',
    },
    ETH_USD: {
        symbol: 'ETH',
        pair: 'ETH/USD',
        address: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7',
    },
    BTC_USD: {
        symbol: 'BTC',
        pair: 'BTC/USD',
        address: '0x5741306c21795FdCBb9b265Ea0255F499DFe515C',
    },
};

// Assignment Contract
export const ASSIGNMENT_CONTRACT_ADDRESS =
    '0xbe7a57ae3296b072547910212855f6e30986aa0f';
