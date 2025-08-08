<template>
  <div v-if="products">
    <button
      class="text-2xl mb-5 hover:cursor-pointer"
      @click="gotoCategory(category)"
    >
      {{ category.name }}
    </button>
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in productS.slice(0, 4)"
        :key="product.id"
        :product="product"
        :load="load"
      />
    </div>
  </div>
</template>
<script setup>
import { useProduct } from "../composables/useProducts";
import ProductCard from "./ProductCard.vue";
import { ref, defineProps, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { getProduct, products, loading } = useProduct();
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
const productS = ref([]);
const load=ref(false)
async function getProdByCat() {
  await getProduct( {...prod.value});
  productS.value = products.value;
  
}
watch(loading, (newVal) => {
  load.value = newVal;
});
onMounted(() => {
  getProdByCat();
});
const gotoCategory = (cat) => {
  router.push({ name: "products", query: { category: cat.name } });
};
</script>