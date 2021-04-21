<template>
  <div class="ticker-container">
    <h1>Ticker</h1>
    <div class="ticker-header">
      <p class="keypair-helper">MARKET</p>
      <p class="actual-value-helper">BID</p>
      <p class="min-helper">ASK</p>
      <p class="max-helper">BUYED AT</p>
      <p class="max-helper">BUY PRICE</p>
      <p class="max-helper">SELL PRICE</p>
    </div>
      <div v-for="ticker in tickers"
          v-bind:key="ticker.state.symbol" class="ticker-row">
        <p class="symbol">{{ticker.state.symbol}}</p>
        <p class="bid">
          {{parseFloat(ticker.state.ticks[ticker.state.ticks.length-1]?.bidPrice).toFixed(3)}}
        </p>
        <p class="ask">
          {{parseFloat(ticker.state.ticks[ticker.state.ticks.length-1]?.askPrice).toFixed(3)}}
        </p>
        <p class="bid-quantity">
          {{buyPrice(ticker)}}
        </p>
        <p class="ask-quantity">
          {{ticker.state.buyPrice.toFixed(2)}}
        </p>
        <p class="ask-quantity">
          {{ticker.state.sellPrice.toFixed(2)}}
        </p>
      </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'Ticker',
    props: {
        tickers: {
            type: Array as PropType<any[]>,
            default: () => []
        }
    },
    setup() {
        const buyPrice = (ticker: any) => {
            const price = parseFloat(ticker.state.order?.buyPrice);
            return Number.isNaN(price) ? '' : price;
        };

        const sellPrice = (ticker: any) => {
            const price = parseFloat(ticker.state.order?.sellPrice);
            return Number.isNaN(price) ? '' : price;
        };

        return {
            buyPrice,
            sellPrice
        };
    }
});
</script>

<style lang="scss">
.ticker-container{
  background-color: rgb(27, 27, 27);
  display: grid;
  color: white;
  h1 {
    padding: 16px;
  }

  .ticker-row{
    color: white;
    padding: 16px;
    border-bottom: 1px solid darkgray;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }

  .ticker-header {
    color: rgb(255, 230, 0);
    padding: 16px;
    border-bottom: 2px solid rgb(255, 230, 0);;
    font-weight: bold;
    font-size: 20px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
