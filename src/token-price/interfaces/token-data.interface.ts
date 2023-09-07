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

export interface IBitfinexTokenData {
    symbol: string;
    data: IBitfinexResponse;
}

export interface ITokenPriceData {
    token_symbol: string;
    token_price: string;
    price_source: string;
    timestamp: Date;
}
