<template>
  <div class="px-10 py-4">

    <div class="max-w-4xl mx-auto p-6">
    <!-- Empty state -->
    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center h-96 text-gray-500 select-none bg-gray-50 rounded-2xl border border-dashed border-gray-300 shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18M3 3v18m0-18l18 18" />
      </svg>
      <p class="text-2xl font-semibold tracking-wide">Your order list is empty</p>
      <p class="mt-2 text-sm text-gray-400">
        You haven’t placed any orders yet. Start shopping now!
      </p>
    </div>
  
    <!-- Order list -->
    <ol
      v-else
      class="space-y-4 mt-4 bg-white p-4 rounded-2xl shadow-lg"
    >
      <li
        v-for="order in orders"
        :key="order.id"
        class="transition-transform transform hover:scale-[1.01] hover:shadow-xl rounded-xl overflow-hidden border border-gray-100"
      >
        <OrderCard :order="order" />
      </li>
    </ol>
  </div>
  <Foter/>
  </div>

</template>

<script setup>
import OrderCard from "./OrderCard.vue";
import Foter from "./Foter.vue";
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
