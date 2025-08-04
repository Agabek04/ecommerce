<template>
  <div class="p-6">
    <div v-if="products.length > 0">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="w-3/4">
          <div
            class="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>

        <div class="w-1/4 fixed right-0 top-24 p-4">
          <div
            class="w-80 bg-white border rounded-lg shadow-md p-5 z-50"
          >
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
              Cart:
            </h2>

            <div class="flex justify-between text-gray-700 mt-3">
              <span>Price:</span>
              <span class="font-medium"
                >{{ Math.round(totalPrice * 100) / 100 }} tmt</span
              >
            </div>

            <div class="flex justify-between text-gray-700 mt-2">
              <span>Delivery:</span>
              <span v-if="totalPrice > 100" class="font-medium">0.00 m.</span>
              <span v-else class="font-medium">+10.00 tmt</span>
            </div>

            <div
              class="flex justify-between font-semibold text-gray-900 text-lg border-t pt-2 mt-2"
            >
              <span>Total price:</span>
              <span v-if="totalPrice > 100"
                >{{ Math.round(totalPrice * 100) / 100 }} tmt</span
              >
              <span v-else
                >{{ Math.round(totalPrice * 100) / 100 + 10 }} tmt</span
              >
            </div>

            <button
              @click="createOrder"
              class="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition w-full mt-4"
            >
              Prepare order
            </button>
          </div>
          <p
            @click="cart.removeFromCart"
            class="text-center text-red-500 hover:underline cursor-pointer mt-3"
          >
            Remove All
          </p>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center h-96 text-gray-400 select-none"
    >
      <p class="text-4xl font-semibold tracking-wide">
        Your shopping cart is empty
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ProductCard from "./ProductCard.vue";
import { useCartStore } from "../stores/cartStore";
import router from "../router";

const cart = useCartStore();
const products = computed(() => cart.products);

const totalPrice = computed(() =>
  cart.products.reduce(
    (acc, p) => acc + parseFloat(p.price) * parseInt(p.count),
    0
  )
);

const createOrder = () => {
  router.push("/createOrder");
};
</script>
