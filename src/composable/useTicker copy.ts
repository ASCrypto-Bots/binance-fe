import { reactive } from '@vue/reactivity';
import to from 'await-to-js';
import axios from 'axios';
import useBalance from './useBalance';

interface TickerState{
    isLoading: boolean;
    error?: string;
    ticks?: any;
}

const state = reactive<TickerState>({
    isLoading: false,
    error: undefined,
    ticks: []
});

export default function useTicker() {
    const { state: balanceState } = useBalance();

    const fetchTicker = async () => {
        const [err, response] = await to(axios.get('http://localhost:8000/api/tickers'));
        if (err || !response) {
            state.error = err?.message ?? 'Generic error';
            state.isLoading = false;
        }
        const keys = Object.keys(response?.data);
        const filterTickerBasedOnAvailableKeys = keys.filter((keyPair: any) => {
            let isAvailable = false;
            balanceState.availableCoinsName.forEach((availableCoin) => {
                if (!isAvailable) {
                    isAvailable = keyPair.indexOf(availableCoin) !== -1;
                }
            });
            return isAvailable;
        });
        const filteredTickerWithActualValue = filterTickerBasedOnAvailableKeys.map((keyPair) => ({
            itemName: keyPair,
            value: response?.data[keyPair]
        }));
        state.ticks = [...state.ticks, filteredTickerWithActualValue];
        state.isLoading = false;
    };

    const getMin = (keyPair: string) => {
        const allTheTicks = state.ticks
            .map((iteration: any) => iteration
                .filter((item: any) => item.itemName === keyPair));
    };

    return {
        state,
        fetchTicker
    };
}
