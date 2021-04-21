<template>
  <div class="app">
    <!-- <div class="test">TEST MODE - FAKE TRADE</div> -->
    <balance/>
    <orders/>
    <ticker :tickers="tickers"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import useBalance from './composable/useBalance';
import useSingleTicker from './composable/useSingleTicker';
import Balance from './components/Balance.vue';
import Ticker from './components/Ticker.vue';
import Orders from './components/Orders.vue';
import KeyPairConfig, { IUseTicker } from './utils/KeyPairConfig';

export default defineComponent({
    name: 'App',
    components: {
        Balance,
        Ticker,
        Orders
    },
    setup() {
        const { fetchBalance } = useBalance();

        const prepareStateAndFetcher = (): any[] => {
            return KeyPairConfig.map((marketPair: IUseTicker) => (useSingleTicker(marketPair)));
        };

        const tickers = ref<any>([]);

        const sleep = (milliseconds: number) => {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        };

        const getTickerWithInterval = async (hook: any, interval = 2000) => {
            setInterval(async () => {
                sleep(interval);
                await hook();
            }, interval);
        };

        onMounted(async () => {
            tickers.value = prepareStateAndFetcher();
            fetchBalance();
            const chainOfRequest = tickers.value.map((item: any) => item.fetchSingleTicker);
            chainOfRequest.forEach(async (request: any) => {
                await getTickerWithInterval(request);
            });
        });

        return {
            tickers
        };
    }
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

.balance-container{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px;
  background-color: rgb(27, 27, 27);
  padding: 8px;
}

.test {
    background-color: red;
    color: white;
}
</style>
