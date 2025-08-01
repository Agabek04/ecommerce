<template>
  <div
    class="m-5 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300 cursor-pointer max-w-3xl mx-auto"
    @click="toggleDetails"
  >
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2"
    >
      <h2 class="text-2xl font-semibold text-gray-900">
        Order #{{ order.id }} — {{ order.name }}
      </h2>
      <span
        :class="statusColor(order.status)"
        class="px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide whitespace-nowrap"
      >
        {{ order.status }}
      </span>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 text-sm mb-6"
    >
      <div>
        <strong>Phone: </strong>
        <span class="text-gray-900">{{ order.phone_number || "N/A" }}</span>
      </div>
      <div>
        <strong>Payment: </strong>
        <span class="text-gray-900">{{ order.payment_type }}</span>
      </div>
      <div class="sm:col-span-2 break-words">
        <strong>Address: </strong>
        <span class="text-gray-900">{{ order.address }}</span>
      </div>
      <div class="sm:col-span-2">
        <strong>Note: </strong>
        <span class="italic text-gray-600">{{ order.note || "-" }}</span>
      </div>
      <div>
        <strong>Total Quantity: </strong>
        <span class="text-gray-900">{{ order.total_quantity }}</span>
      </div>
      <div>
        <strong>Total Price: </strong>
        <span class="text-gray-900">
          {{ Math.round(order.total_price * 100) / 100 }}tmt</span
        >
      </div>
      <div class="sm:col-span-2 text-right text-xs text-gray-500 italic">
        Created: {{ formattedDate }}
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showDetails"
        class="border-t pt-4 space-y-4 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <p class="font-semibold text-gray-800 text-lg mb-3">
          Products in this order:
        </p>

        <div v-if="loading" class="text-gray-500 text-center">
          Loading products...
        </div>

        <div v-else>
          <div v-if="products.length > 0" class="flex flex-col gap-4">
            <div
              v-for="item in products"
              :key="item.id"
              class="flex items-center gap-4 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
            >
              <img
                v-if="item.image"
                :src="item.image"
                alt="product image"
                class="w-16 h-16 object-cover rounded-md border"
              />
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 text-lg truncate">
                  {{ item.name }}
                </p>
                <p class="text-sm text-gray-600">
                  Price: {{ Math.round(item.price * 100) / 100 }}tmt
                </p>
                <p class="text-sm text-gray-600">Quantity: {{ item.count }}</p>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-500">
            No products in this order
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../composables/api";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const showDetails = ref(false);
const products = ref([]);
const loading = ref(false);

const toggleDetails = async () => {
  showDetails.value = !showDetails.value;

  if (showDetails.value && products.value.length === 0) {
    loading.value = true;
    try {
      const res = await api.get(`/order-items/${props.order.id}`);
      products.value = res.data;
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      loading.value = false;
    }
  }
};

const statusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formattedDate = computed(() => {
  if (!props.order.created_at) return "N/A";
  return new Date(props.order.created_at).toLocaleString();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}
.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}
.scrollbar-thumb-gray-300::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
</style>