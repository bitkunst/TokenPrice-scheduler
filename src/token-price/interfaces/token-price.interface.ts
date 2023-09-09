export interface IBitfinexResponse {
    mid: string;
    bid: string;
    ask: string;
    last_price: string;
    low: string;
    high: string;
    volume: string;
    timestamp: string;
}

export interface ITokenData {
    symbol: string;
    pair: string;
    price: string;
    timestamp: string;
}

export interface ITokenPrice {
    token_symbol: string;
    token_pair: string;
    token_price: string;
    price_source: string;
    timestamp: Date;
}
