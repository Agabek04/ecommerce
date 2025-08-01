<template>
  <div
    class="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-300/40 transition-shadow duration-300 relative text-gray-800 p-3 py-5 flex flex-col items-center group justify-between"
  >
    <button
      @click="goToProduct"
      class="absolute inset-0 z-10 cursor-pointer"
      aria-label="View product details"
    ></button>

    <div class="relative">
      <img
        :src="`https://ecommerce-2-84fp.onrender.com/${product.main_image}`"
        :alt="product.name"
        class="w-56 h-56 object-cover rounded-xl mb-3 transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <div class="text-center px-8 flex flex-col justify-between items-start w-86">
      <h2
        class="text-lg font-semibold mb-1 truncate max-w-[180px] text-gray-900"
      >
        {{ product.name }}
      </h2>
      <p class="text-gray-500 text-sm mb-2 line-clamp-2">
        {{ product.description }}
      </p>
      <h1 class="font-bold text-green-600 text-lg">{{ product.price }}tmt</h1>
    </div>

    <div class="flex items-center justify-between w-full mt-4 px-3">
  <!-- Favorite Button -->
  <button
    @click.stop="addToFavorite"
    :class="[
      'w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300 z-20',
      added
        ? 'bg-red-100 border-red-300 text-red-500'
        : 'bg-gray-100 border-gray-300 text-gray-500 hover:border-red-400 hover:bg-red-50 hover:text-red-500'
    ]"
    aria-pressed="added"
    aria-label="Add to favorites"
  >
    <svg
      v-if="added"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m7 1031.4c-1.5355 0-3.0784 0.5-4.25 1.7-2.3431 2.4-2.2788 6.1 0 8.5l9.25 9.8 9.25-9.8c2.279-2.4 2.343-6.1 0-8.5-2.343-2.3-6.157-2.3-8.5 0l-0.75 0.8-0.75-0.8c-1.172-1.2-2.7145-1.7-4.25-1.7z"
        fill="#e74c3c"
        transform="translate(0 -1028.4)"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"
      />
    </svg>
  </button>

  <!-- Cart Buttons -->
  <div class="z-20">
    <!-- Agar cartda bor bo‘lsa count + - chiqadi -->
    <div
      v-if="isAdding"
      class="border w-28 flex justify-between items-center rounded-full bg-gray-50 shadow-inner px-2 py-1"
    >
      <button
        @click="removeFromCart"
        class="text-red-500 hover:bg-red-100 rounded-full w-8 h-8 flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
        </svg>
      </button>

      <p class="text-gray-800 font-semibold">{{ count }}</p>

      <button
        @click="addToCart"
        class="text-green-500 hover:bg-green-100 rounded-full w-8 h-8 flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>

    <!-- Agar cartga hali qo‘shilmagan bo‘lsa -->
    <button
      v-else
      @click="addToCart(1)"
      class="flex justify-center items-center rounded-full w-28 h-10 bg-green-500 text-white hover:bg-green-600 transition shadow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 576 512"
      >
        <path
          fill="currentColor"
          d="m528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"
        />
      </svg>
    </button>
  </div>
</div>

  </div>
</template>



<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useCartStore } from "../stores/cartStore";
const cart = useCartStore();
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
const favorite = useFavoriteStore();

const router = useRouter();
const added = computed(() => favorite.isFavorite(props.product));
const addToFavorite = () => {
  if (added.value) {
    favorite.removeFavorite(props.product);
  } else {
    favorite.addFavorite(props.product);
  }
};

const goToProduct = () => {
  router.push(`/product/${props.product.id}`);
};

const isAdding = computed(() => cart.isInCart(props.product.id));

const count = computed(() => cart.getCount(props.product.id));

const addToCart = () => {
  cart.addToCart(props.product);
};

const removeFromCart = () => {
  cart.decreaseFromCart(props.product);
};
</script>
