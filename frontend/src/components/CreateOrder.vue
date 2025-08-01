<template>
  <div class="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
    <h2 class="text-3xl font-semibold text-center mb-8 text-gray-800">Create Order</h2>
    
    <form @submit.prevent="orderCreate" class="flex flex-col gap-5">
      <input
        v-model="name"
        type="text"
        placeholder="Full Name"
        class="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        required
      />
      <input
        v-model="phone_number"
        type="tel"
        placeholder="Phone Number"
        class="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        pattern="[0-9+()\- ]{7,}"
        title="Please enter a valid phone number"
        required
      />
      <input
        v-model="address"
        type="text"
        placeholder="Address"
        class="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        required
      />
      <input
        v-model="note"
        type="text"
        placeholder="Note (optional)"
        class="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      />
      <select
        v-model="payment_type"
        class="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        required
      >
        <option value="" disabled>Select Payment Type</option>
        <option value="cash">Cash</option>
        <option value="credit_card">Credit Card</option>
        <option value="online">Online Payment</option>
      </select>

      <button
        type="submit"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md shadow-md transition"
      >
        Place Order
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrder } from "../composables/useOrders";
import { useCartStore } from "../stores/cartStore";
import { useRouter } from "vue-router";

const router = useRouter();
const cart = useCartStore();
const products = computed(() => cart.products);
const { createOrder } = useOrder();

const name = ref("");
const phone_number = ref("");
const address = ref("");
const note = ref("");
const payment_type = ref("");

const orderCreate = async () => {
  if (!name.value || !phone_number.value || !address.value || !payment_type.value) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await createOrder(
      name.value,
      phone_number.value,
      address.value,
      note.value,
      payment_type.value,
      products.value
    );

    localStorage.removeItem("products");
    localStorage.setItem("countOfPrductsInCart", 0);
    router.push("/orders");
  } catch (error) {
    alert("Failed to create order. Please try again.");
    console.error(error);
  }
};
</script>
