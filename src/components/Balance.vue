<template>
  <div class="balance">
    <h1>Balance</h1>
    <div v-if="state.isLoading">Loading...</div>
    <div v-else class="balance-container">
       <div class="balance-card"
            v-for="item in state.balance"
            v-bind:key="item.itemName">
          <h4 class="item-name">{{item.itemName}}</h4>
          <p>Available: {{item.available}}</p>
          <p>On Order:  {{item.onOrder}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useBalance from '@/composable/useBalance';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Balance',
    setup() {
        const { state } = useBalance();
        return {
            state
        };
    }
});
</script>

<style lang="scss">
.balance {
    background-color: rgb(27, 27, 27);
    color: white;
    h1 {
      padding: 16px;
    }
    .balance-container{
      padding: 8px 16px 32px 16px;
    }
}

.balance-card{
  background-color: rgb(44, 44, 44);
  color: rgb(204, 204, 204);
  h4{
    padding: 8px;
    color: rgb(255, 230, 0);

  }
  p {
    padding: 8px;
  }
}
</style>
