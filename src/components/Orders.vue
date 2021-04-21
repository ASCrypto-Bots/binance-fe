<template>
  <div class="ticker-container">
    <h1>Closed orders</h1>
    <div class="order-header">
      <p class="keypair-helper">MARKET</p>
      <p class="keypair-helper">BUY PRICE</p>
      <p class="actual-value-helper">SELL PRICE</p>
      <p class="min-helper">QUANTITY</p>
    </div>
    <div v-for="(order, index) in allOrders"
          v-bind:key="index">
      <div v-if="order !== null" class="order-row">
        <p v-if="order" class="symbol">{{order?.market}}</p>
        <p v-if="order" class="symbol">{{order?.buyPrice}}</p>
        <p v-if="order" class="symbol">{{order?.minSellPrice}}</p>
        <p v-if="order" class="symbol">{{order?.quantity}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useOrders from '@/composable/useOrders';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'Orders',
    setup() {
        return {
            ...useOrders()
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

  .order-row{
    color: white;
    padding: 16px;
    border-bottom: 1px solid darkgray;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .order-header {
    color: rgb(255, 230, 0);
    padding: 16px;
    border-bottom: 2px solid rgb(255, 230, 0);;
    font-weight: bold;
    font-size: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
