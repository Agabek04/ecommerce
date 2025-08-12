<template>
  <div v-if="similarProducts.length > 0" class="mt-10 px-4">
    <h2 class="text-2xl font-semibold mb-4">Similar Products</h2>

    <div
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in similarProducts"
        :key="product.id"
        :product="product"
        :load="loading"
      />
    </div>
  </div>

  <div v-else-if="loading" class="text-center py-10 text-gray-500">
    Loading similar products...
  </div>

  <div v-else class="text-center py-10 text-gray-400">
    No similar products found.
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProduct } from "../composables/useProducts";
import { useCategory } from "../composables/useCategory";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  categoryId: {
    type: [Number],
    required: true,
  },
  excludeProductId: {
    type: [Number],
    default: null,
  },
});
const { getProduct, products, loading } = useProduct();
const { getCategories, categories } = useCategory();
const similarProducts = ref([]);
const load = ref(false);
const router = useRouter();
const similarCategory = ref();

// function shuffleArray(array) {
//   return array
//     .map((item) => ({ item, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ item }) => item);
// }
async function fetchSimilarProducts() {
  if (!props.categoryId) {
    similarProducts.value = [];
    return;
  }
  await getCategories();
  similarCategory.value = categories.value.find(
    (category) => category.id === props.categoryId
  );
  await getProduct({ categoryName: similarCategory.value.name, limit: 10 });
  similarProducts.value = products.value.filter(
    (p) => p.id !== props.excludeProductId
  );
//   similarProducts.value = shuffleArray(filtered).slice(0, 4);
}

watch(loading, (newVal) => {
  load.value = newVal;
});
onMounted(() => {
  fetchSimilarProducts();
});
watch(
  () => [props.categoryId],
  () => {
    fetchSimilarProducts();
  },
  { immediate: true }
);
</script>
