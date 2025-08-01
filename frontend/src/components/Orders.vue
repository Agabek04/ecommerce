<template>
  <div class="max-w-4xl mx-auto p-4">
     <div v-if="orders.length === 0" class="flex flex-col items-center justify-center h-96 text-gray-400 select-none">
      <p class="text-4xl font-semibold tracking-wide">Your order list is empty</p>
    </div>
    
    <ol class="space-y-4">
      <li v-for="order in orders" :key="order.id">
        <OrderCard :order="order" />
      </li>
    </ol>
  </div>
</template>

<script setup>
import OrderCard from "./OrderCard.vue";
import { ref, onMounted } from "vue";
import { useOrder } from "../composables/useOrders";

const { getOrders } = useOrder();
const orders = ref([]);

const getOrder = async () => {
  orders.value = await getOrders();
};

onMounted(() => {
  getOrder();
});
</script>
