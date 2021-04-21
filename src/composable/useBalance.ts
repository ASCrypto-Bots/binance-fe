import { reactive } from '@vue/reactivity';
import to from 'await-to-js';
import axios from 'axios';

interface BalanceState{
    isLoading: boolean;
    error?: string;
    balance?: any;
    availableCoinsName: string[]
}

const state = reactive<BalanceState>({
    isLoading: false,
    error: undefined,
    balance: [],
    availableCoinsName: []
});

export default function useBalance() {
    const fetchBalance = async () => {
        const [err, response] = await to(axios.get('http://localhost:8000/api/balance'));
        if (err || !response) {
            state.error = err?.message ?? 'Generic error';
            state.isLoading = false;
        }
        const keys = Object.keys(response?.data);
        const allItems = keys.map((itemKey) => {
            const item = response?.data[itemKey];
            return {
                itemName: itemKey,
                ...item
            };
        });
        const filteredItems = allItems.filter((item): any => parseFloat(item.available) > 0);
        const availableCoins = filteredItems.map((item): any => item.itemName);
        state.balance = filteredItems;
        state.availableCoinsName = availableCoins;
        state.isLoading = false;
    };

    const getBalancePer = (coin: string) => {
        const selectedCoin = state.balance.filter((item: any) => item.itemName === coin);
        return selectedCoin[0].available || 0;
    };

    return {
        state,
        fetchBalance,
        getBalancePer
    };
}
