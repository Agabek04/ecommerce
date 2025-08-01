<template>
  <div class="p-6 md:px-14 w-full min-h-screen bg-gray-50">
    <p class="text-3xl font-extrabold mb-8 text-gray-800 text-center capitalize">
      {{ query.categoryName || 'Barcha mahsulotlar' }}
    </p>

    <div v-if="products.length" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <p v-else class="text-gray-500 text-center mt-20 text-lg">
      Products not found
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProduct } from "../composables/useProducts";
import { useRoute } from "vue-router";
import ProductCard from "./ProductCard.vue";
import { useCategoryStore } from "../stores/useCategoryStore";

const route = useRoute();
const { getProduct } = useProduct();
const categoryStore = useCategoryStore();

const query = ref({
  categoryName: route.query.category || null,
  name: "",
  limit: 20,
  page: 1,
});

const products = ref([]);

watch(
  () => route.query.category,
  async (newCategory) => {
    const category = newCategory || null;
    categoryStore.setCategory(category);
    query.value.categoryName = category;

    try {
      const res = await getProduct(query.value);
      products.value = res?.products || [];
    } catch (err) {
      console.error(err);
      products.value = [];
    }
  },
  { immediate: true }
);
</script>
