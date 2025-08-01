<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50"
  >
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
      <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Create Account
      </h2>
      <p class="text-gray-500 text-center mb-8 text-sm">
        Sign up to manage your account
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <input
          v-model="form.name"
          placeholder="Full Name"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          required
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email address"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          required
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          required
        />

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition"
        >
          Register
        </button>
      </form>

      <p v-if="error" class="text-red-500 mt-4 text-center text-sm">
        {{ error }}
      </p>

      <p class="text-center text-gray-600 mt-6 text-sm">
        Already have an account?
        <router-link
          to="/login"
          class="text-green-600 hover:underline font-medium"
        >
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/register.js";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  name: "",
  email: "",
  password: "",
});
const { signUp, error } = useAuth();
const success = ref("");

const handleSubmit = async () => {
  await signUp(form.value);

  if (!error.value) {
    form.value = { name: "", email: "", password: "" };
    router.push("/login");
  } else {
    success.value = "";
  }
};
</script>
