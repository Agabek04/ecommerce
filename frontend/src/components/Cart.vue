<template>
  <div class="p-4 sm:p-6 w-full">
    <div v-if="products.length > 0">
      <div class="flex flex-col lg:flex-row gap-6 lg:justify-between">
        <!-- Products -->
        <div class="w-full lg:w-2/3">
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>

        <!-- Cart Summary -->
        <div
          class="max-w-80 lg:w-1/3 lg:sticky lg:top-24"
        >
          <div class="bg-white border rounded-lg shadow-md p-5">
            <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
              Cart:
            </h2>

            <div class="flex justify-between text-gray-700 mt-3">
              <span>Price:</span>
              <span class="font-medium">
                {{ Math.round(totalPrice * 100) / 100 }} tmt
              </span>
            </div>

            <div class="flex justify-between text-gray-700 mt-2">
              <span>Delivery:</span>
              <span v-if="totalPrice > 100" class="font-medium">0.00 tmt</span>
              <span v-else class="font-medium">+10.00 tmt</span>
            </div>

            <div
              class="flex justify-between font-semibold text-gray-900 text-lg border-t pt-2 mt-2"
            >
              <span>Total price:</span>
              <span v-if="totalPrice > 100">
                {{ Math.round(totalPrice * 100) / 100 }} tmt
              </span>
              <span v-else>
                {{ Math.round(totalPrice * 100) / 100 + 10 }} tmt
              </span>
            </div>

            <button
              @click="createOrder"
              class="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition w-full mt-4"
            >
              Prepare order
            </button>

            <p
              @click="cart.removeFromCart"
              class="text-center text-red-500 hover:underline cursor-pointer mt-3"
            >
              Remove All
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty cart -->
    <div
      v-else
      class="flex flex-col items-center justify-center h-96 text-gray-400 select-none"
    >
      <p class="text-4xl font-semibold tracking-wide text-center px-4">
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
