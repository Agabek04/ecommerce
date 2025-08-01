<template>
  <div v-if="products">
    <button
      class="text-2xl mb-5 hover:cursor-pointer"
      @click="gotoCategory(category)"
    >
      {{ category.name }}
    </button>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <ProductCard
        v-for="product in products.slice(0, 4)"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>
<script setup>
import { useProduct } from "../composables/useProducts";
import ProductCard from "./ProductCard.vue";
import { ref, defineProps } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { getProduct } = useProduct();
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});
const prod = ref({
  categoryName: props.category.name,
  name: "",
});
const products = ref([]);
async function getProdByCat() {
  const res = await getProduct(prod.value);
  products.value = res.products;
}
getProdByCat();

const gotoCategory = (cat) => {
  router.push({ name: "products", query: { category: cat.name } });
};
</script>