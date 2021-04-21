import { reactive } from '@vue/reactivity';
import to from 'await-to-js';
import axios from 'axios';
// eslint-disable-next-line
import useBalance from './useBalance';
import useOrders from './useOrders';
import { IUseTicker } from '../utils/KeyPairConfig';

interface TickerState{
    isLoading: boolean;
    error?: string;
    ticks?: any;
    symbol: string;
    min: number;
    max: number;
    mid: number,
    buyPrice: number,
    sellPrice: number,
    gapFromBuy: number,
    gapFromSell: number,
    iterations: number,
    order: any
}

export default function useSingleTicker(options: IUseTicker) {
    const state = reactive<TickerState>({
        isLoading: false,
        error: undefined,
        ticks: [],
        symbol: options.market,
        min: 0,
        max: 0,
        mid: 0,
        buyPrice: 0,
        sellPrice: 0,
        gapFromBuy: 0,
        gapFromSell: 0,
        iterations: 0,
        order: null
    });

    const { addOrder } = useOrders();

    const { fetchBalance, getBalancePer } = useBalance();

    const getMin = () => {
        const measurements = state.ticks.map((singleTick: any) => parseFloat(singleTick.askPrice));
        return Math.min(...measurements);
    };

    const getMax = () => {
        const measurements = state.ticks.map((singleTick: any) => parseFloat(singleTick.bidPrice));
        return Math.max(...measurements);
    };

    const getMedian = () => ((getMin() + getMax()) / 2);

    const getBuyPrice = () => (getMedian() - ((getMedian() * 0.2) / 100));

    const getSellPrice = () => (getMedian() + ((getMedian() * 0.2) / 100));

    const gapFromBuy = () => (state.ticks[state.ticks.length - 1]?.askPrice - getBuyPrice());

    const gapFromSell = () => (state.ticks[state.ticks.length - 1]?.bidPrice - getSellPrice());

    const percentage = (buyPrice: number, sellPrice: number) => ((100 * buyPrice) / sellPrice);

    const fetchBuy = async (quantity: any, price: any) => {
        state.order = {
            status: 'PENDING',
            buyPrice: price,
            date: new Date(),
            quantity,
            minSellPrice: getSellPrice(),
            market: options.market
        };
        const [err, response] = await to(axios.get('http://localhost:8000/api/buy', {
            params: {
                quantity: parseFloat(quantity).toFixed(options.quantityGranularity),
                price: parseFloat(price).toFixed(options.priceGranularity),
                symbol: state.symbol
            }
        }));
        if (err || !response) {
            state.error = err?.message ?? 'Generic error';
            state.order = null;
        }
        console.log(`${state.symbol} Buy ${quantity} at ${price}`);
    };

    const fetchSell = async (sellPrice: any) => {
        const [err, response] = await to(axios.get('http://localhost:8000/api/sell', {
            params: {
                quantity: parseFloat(state.order.quantity).toFixed(options.quantityGranularity),
                price: parseFloat(sellPrice).toFixed(options.priceGranularity),
                symbol: state.symbol
            }
        }));
        if (err || !response) {
            state.error = err?.message ?? 'Generic error';
        }
        console.log(`${state.symbol} Sell ${state.order.quantity} at ${sellPrice}`);
        addOrder(state.order);
        state.order = null;
    };

    const checkAndBuy = () => {
        const lastCheckPrice3 = state.ticks[state.ticks.length - 4]?.askPrice;
        const lastCheckPrice2 = state.ticks[state.ticks.length - 3]?.askPrice;
        const lastCheckPrice = state.ticks[state.ticks.length - 2]?.askPrice;
        const actualAskPrice = state.ticks[state.ticks.length - 1]?.askPrice;
        const actualAskPricePlus10Percent = actualAskPrice + ((actualAskPrice * 10) / 100);
        const availableBUSD = getBalancePer(options.mainCoin) / 1;
        const actualBuyPrice = getBuyPrice();
        const actualSellPrice = getSellPrice();
        const differenceBuySellPercent = 100 - percentage(actualBuyPrice, actualSellPrice);
        if (actualAskPrice <= actualBuyPrice
            && state.iterations > 120
            && state.order === null
            && availableBUSD > 10
            && actualAskPrice >= lastCheckPrice
            && actualAskPrice >= lastCheckPrice2
            && actualAskPrice >= lastCheckPrice3
            && differenceBuySellPercent > 0.13) {
            const quantity = availableBUSD / actualAskPrice;
            fetchBuy(quantity, actualAskPrice);
        }
    };

    const checkAndSell = () => {
        if (state.order) {
            fetchBalance();
            const lastCheckPrice3 = state.ticks[state.ticks.length - 4]?.bidPrice;
            const lastCheckPrice2 = state.ticks[state.ticks.length - 3]?.bidPrice;
            const lastCheckPrice = state.ticks[state.ticks.length - 2]?.bidPrice;
            const actualBidPrice = state.ticks[state.ticks.length - 1]?.bidPrice;
            if (actualBidPrice >= state.order.minSellPrice
                && actualBidPrice <= lastCheckPrice3
                && actualBidPrice <= lastCheckPrice2
                && actualBidPrice <= lastCheckPrice) {
                fetchSell(actualBidPrice);
            }
        }
    };

    const fetchSingleTicker = async () => {
        const [err, response] = await to(axios.get('http://localhost:8000/api/singleticker', {
            params: {
                symbol: options.market
            }
        }));
        if (err || !response) {
            state.error = err?.message ?? 'Generic error';
            state.isLoading = false;
        }
        const { symbol, ...rest } = response?.data;
        state.ticks = [...state.ticks, rest];
        state.min = getMin();
        state.max = getMax();
        state.mid = getMedian();
        state.buyPrice = getBuyPrice();
        state.sellPrice = getSellPrice();
        state.gapFromBuy = gapFromBuy();
        state.gapFromSell = gapFromSell();
        state.iterations = state.iterations + 1;
        checkAndBuy();
        checkAndSell();
        state.isLoading = false;
    };

    return {
        state,
        getMin,
        getMax,
        getMedian,
        fetchSingleTicker
    };
}
