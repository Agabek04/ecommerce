<template>
  <div class="px-10 py-4">
    <p
      class="text-3xl font-extrabold mb-8 text-gray-800 text-center capitalize"
    >
      {{ query.categoryName }}
    </p>

    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="n in 8"
        :key="n"
        class="h-64 bg-gray-200 rounded-xl animate-pulse"
      ></div>
    </div>

    <div
      v-else-if="productS.length"
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in productS"
        :key="product.id"
        :product="product"
      />
    </div>

    <p v-else class="text-gray-500 text-center mt-20 text-lg">
      Products not found
    </p>
    <Foter/>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProduct } from "../composables/useProducts";
import { useRoute } from "vue-router";
import ProductCard from "./ProductCard.vue";
import Foter from "./Foter.vue";
import { useCategoryStore } from "../stores/useCategoryStore";

const route = useRoute();
const { getProduct, products, loading } = useProduct();
const categoryStore = useCategoryStore();

const query = ref({
  categoryName: route.query.category || null,
  name: "",
  limit: 20,
  page: 1,
});

const productS = ref([]);

watch(
  () => route.query.category,
  async (newCategory) => {
    const category = newCategory || null;
    categoryStore.setCategory(category);
    query.value.categoryName = category;

    try {
      await getProduct(query.value);
      productS.value = products.value;
    } catch (err) {
      console.error(err);
      productS.value = [];
    }
  },
  { immediate: true }
);
</script>

<style>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
