<script setup>
import { useSearchStore } from "../stores/searchStore";
import { useProduct } from "../composables/useProducts";
import { computed } from "vue";
import ProductCard from "./ProductCard.vue";

const searchStore = useSearchStore();
const products = computed(() => searchStore.products);
</script>

<template>
  <div class="p-5 sm:p-10 min-h-screen bg-gray-50">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
      Search Results
    </h2>

    <div v-if="products && products.length > 0">
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          class="transition-transform hover:scale-[1.02] duration-200"
        />
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center text-center py-20"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="w-16 h-16 text-gray-400 mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
        />
      </svg>
      <p class="text-gray-500 text-lg">No products found</p>
    </div>
  </div>
</template>
