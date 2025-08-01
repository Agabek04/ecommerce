<template>
  <div class="p-10">
    <div v-if="favorites.length === 0" class="flex flex-col items-center justify-center h-96 text-gray-400 select-none">
      <p class="text-4xl font-semibold tracking-wide">Your wish list is empty</p>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      <ProductCard
        v-for="favorite in favorites"
        :key="favorite.id"
        :product="favorite"
        class="bg-white rounded-xl shadow-lg border border-transparent hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ProductCard from "./ProductCard.vue";
import { useFavoriteStore } from "../stores/favoriteStore";

const favoriteStore = useFavoriteStore();
const favorites = computed(() => favoriteStore.favorites);
</script>
