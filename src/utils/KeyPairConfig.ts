export interface IUseTicker {
    market: string;
    quantityGranularity: number;
    priceGranularity: number;
    mainCoin: string;
}

export default [
    {
        market: 'BTCBUSD',
        quantityGranularity: 6,
        priceGranularity: 2,
        mainCoin: 'BUSD'
    },
    {
        market: 'ETHBUSD',
        quantityGranularity: 5,
        priceGranularity: 2,
        mainCoin: 'BUSD'
    },
    {
        market: 'BNBBUSD',
        quantityGranularity: 5,
        priceGranularity: 3,
        mainCoin: 'BUSD'
    },
    {
        market: 'XRPBUSD',
        quantityGranularity: 1,
        priceGranularity: 5,
        mainCoin: 'BUSD'
    },
    {
        market: 'DOGEBUSD',
        quantityGranularity: 0,
        priceGranularity: 6,
        mainCoin: 'BUSD'
    },
    {
        market: 'BTCUSDT',
        quantityGranularity: 6,
        priceGranularity: 2,
        mainCoin: 'USDT'
    },
    {
        market: 'ETHUSDT',
        quantityGranularity: 5,
        priceGranularity: 2,
        mainCoin: 'USDT'
    },
    {
        market: 'BNBUSDT',
        quantityGranularity: 5,
        priceGranularity: 3,
        mainCoin: 'USDT'
    },
    {
        market: 'XRPUSDT',
        quantityGranularity: 1,
        priceGranularity: 5,
        mainCoin: 'USDT'
    },
    {
        market: 'DOGEUSDT',
        quantityGranularity: 0,
        priceGranularity: 6,
        mainCoin: 'USDT'
    }
];
