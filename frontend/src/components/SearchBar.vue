<template>
  <div class="flex justify-center w-full px-3">
    <div
      class="flex w-full max-w-md bg-white rounded-full shadow-md border border-gray-200 focus-within:border-gray-400 transition"
    >
      <input
        v-model.trim="searchQuery.name"
        @keyup.enter="searchProduct"
        type="text"
        placeholder="Search products..."
        class="flex-1 px-5 py-2 bg-transparent rounded-l-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
      />

      <button
        @click="searchProduct"
        class="px-4 bg-gray-300 hover:bg-gray-400 rounded-full text-white transition flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 212 212"
          class="w-5 h-5"
        >
          <path
            d="M 210.3 199.72 L 174.3 163.77 C 191.037 144.305 199.589 119.087 198.145 93.456 C 196.701 67.825 185.37 43.728 166.552 26.266 C 147.734 8.805 122.858 -0.695 97.191 -0.222 C 71.524 0.252 47.015 10.663 28.854 28.807 C 10.693 46.951 0.259 71.45 -0.239 97.116 C -0.737 122.783 8.74 147.668 26.184 166.503 C 43.628 185.337 67.714 196.691 93.344 198.159 C 118.973 199.627 144.199 191.099 163.68 174.38 L 199.68 210.38 C 201.103 211.711 202.989 212.437 204.937 212.404 C 206.885 212.371 208.746 211.582 210.123 210.203 C 211.5 208.825 212.288 206.964 212.319 205.015 C 212.35 203.067 211.622 201.182 210.29 199.76 Z M 15.11 99.19 C 15.11 76.889 23.979 55.478 39.748 39.708 C 55.518 23.939 76.929 15.07 99.23 15.07 C 121.531 15.07 142.942 23.939 158.712 39.708 C 174.481 55.478 183.35 76.889 183.35 99.19 C 183.35 121.491 174.481 142.902 158.712 158.672 C 142.942 174.441 121.531 183.31 99.23 183.31 C 76.937 183.284 55.541 174.406 39.777 158.643 C 24.014 142.879 15.136 121.483 15.11 99.19 Z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSearchStore } from "../stores/searchStore";
import { useProduct } from "../composables/useProducts";
import { useRouter } from "vue-router";

const router = useRouter();
const { getProduct,products } = useProduct();
const searchStore = useSearchStore();

const searchQuery = ref({
  categoryName: "",
  name: "",
  limit: 20,
  page: 1,
});

async function searchProduct() {
  if (!searchQuery.value.name) return;

  await getProduct(searchQuery.value);
  searchStore.setProducts(products.value);

  router.push({
    path: "/search",
    query: { products: searchQuery.value.name },
  });
}
</script>
