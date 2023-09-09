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
    price: string;
    timestamp: string;
}

export interface ITokenPriceDto {
    token_symbol: string;
    token_price: string;
    price_source: string;
    timestamp: Date;
}
