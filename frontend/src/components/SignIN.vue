<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50"
  >
    <div class="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
      <h2 class="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Welcome Back
      </h2>
      <p class="text-gray-500 text-center mb-8 text-lg">Login</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email address"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div>
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div class="text-right">
          <router-link
            to="/login"
            class="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </router-link>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow-md transition"
        >
          Login
        </button>
      </form>

      <p v-if="error" class="text-red-500 mt-4 text-center text-sm">
        {{ error }}
      </p>

      <p class="text-center text-gray-600 mt-6 text-sm">
        Don't have an account?
        <router-link
          to="/register"
          class="text-blue-600 hover:underline font-medium"
        >
          Sign Up
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
  email: "",
  password: "",
});
const { signIn, error } = useAuth();
const success = ref("");

const handleSubmit = async () => {
  await signIn(form.value);
  if (!error.value) {
    form.value = { email: "", password: "" };
    router.push("/");
  } else {
    success.value = "";
  }
};
</script>
