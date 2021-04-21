import { reactive } from '@vue/reactivity';

const allOrders = reactive<any[]>([]);

export default function useOrders() {
    const addOrder = (order: any) => {
        allOrders.push(order);
    };

    return {
        allOrders,
        addOrder
    };
}
