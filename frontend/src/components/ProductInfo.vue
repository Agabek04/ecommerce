<template>
  <div>
    <div class="min-h-screen bg-gray-100 py-10 px-5">
      <div
        class="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <div class="md:w-1/2 p-4">
          <div
            class="relative w-[400px] h-[400px] rounded-xl shadow-md overflow-hidden"
          >
            <div
              v-if="loading"
              class="absolute inset-0 bg-gray-200 rounded-xl animate-pulse z-10"
            ></div>

            <img
              v-else
              :src="product.main_image"
              alt="Main Image"
              class="w-full h-full object-cover rounded-xl"
              @load="handleImageLoad"
            />
          </div>
          <div
            v-if="product.images && product.images.length"
            class="flex gap-3 mt-4 overflow-x-auto"
          >
            <img
              v-for="image in product.images"
              :key="image"
              :src="`${image}`"
              alt="Product Thumbnail"
              class="w-20 h-20 object-cover rounded-md border hover:scale-105 transition-transform cursor-pointer"
            />
          </div>
        </div>

        <div class="md:w-1/2 m-4 flex flex-col justify-between">
          <div class="mt-4 flex flex-col justify-between">
            <div v-if="loading" class="animate-pulse">
              <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>

              <div class="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            </div>

            <div v-else class="m-4 flex flex-col justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                  {{ product.name }}
                </h1>
                <p class="text-gray-600 mb-6">{{ product.description }}</p>
                <p class="text-2xl font-semibold text-green-600 mb-6">
                  {{ product.price }} tmt
                </p>
              </div>
            </div>
          </div>

          <div>
            <div class="flex gap-4 items-center">
              <button
                @click="toggleFavorite"
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center border transition',
                  isFavorite
                    ? 'bg-red-100 border-red-300 text-red-500'
                    : 'bg-gray-100 border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-400',
                ]"
              >
                <svg
                  v-if="isFavorite"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="m7 1031.4c-1.5355 0-3.0784 0.5-4.25 1.7-2.3431 2.4-2.2788 6.1 0 8.5l9.25 9.8 9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-0.75 0.8-0.75-0.8c-1.172-1.2-2.7145-1.7-4.25-1.7z"
                    transform="translate(0 -1028.4)"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
                  />
                </svg>
              </button>

              <div
                v-if="isInCart"
                class="border flex rounded-full items-center bg-white shadow px-3 py-1"
              >
                <button
                  @click="decreaseFromCart"
                  class="text-red-500 hover:bg-red-100 rounded-full w-8 h-8 flex justify-center items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <p class="mx-3 font-semibold text-gray-700">{{ cartCount }}</p>
                <button
                  @click="increaseCart"
                  class="text-green-500 hover:bg-green-100 rounded-full w-8 h-8 flex justify-center items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <button
                v-else
                @click="addToCart"
                class="bg-green-500 text-white px-6 py-3 rounded-xl shadow hover:bg-green-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts :categoryId="product.category_id" :excludeProductId="product.id"/>
    </div>
    <Foter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useProduct } from "../composables/useProducts";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useCartStore } from "../stores/cartStore";
import Foter from "./Foter.vue";
import SimilarProducts from "./SimilarProducts.vue";

const favorite = useFavoriteStore();
const cart = useCartStore();

const { getProduct, products, loading } = useProduct();
const route = useRoute();
const product = ref({});
const load = ref(false);
const prod = ref({
  categoryName: "",
  name: "",
  id: 0,
});

async function getProdByCat() {
  prod.value.id=route.params.id
  await getProduct({ ...prod.value });
  product.value = products.value[0];
  console.log(prod.value)
}
watch(loading, (newVal) => {
  load.value = newVal;
});
onMounted(() => getProdByCat());
watch(
  () => route.params.id,
  () => {
    getProdByCat();
  }
);
const isFavorite = computed(() => favorite.isFavorite(product.value));
function toggleFavorite() {
  if (isFavorite.value) {
    favorite.removeFavorite(product.value);
  } else {
    favorite.addFavorite(product.value);
  }
}

const isInCart = computed(() => cart.isInCart(product.value.id));
const cartCount = computed(() => cart.getCount(product.value.id));

function addToCart() {
  cart.addToCart(product.value);
}

function increaseCart() {
  cart.addToCart(product.value);
}

function decreaseFromCart() {
  cart.decreaseFromCart(product.value);
}
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