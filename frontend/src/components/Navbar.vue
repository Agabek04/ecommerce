<template>
  <div
    class="flex w-full h-20 border items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 bg-white shadow"
  >
    <button
      @click="menuOpen = !menuOpen"
      class="md:hidden p-2 rounded hover:bg-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 text-gray-700"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>

    <div class="hidden md:block">
      <CategoryList />
    </div>

    <div class="flex-1 mx-4">
      <SearchBar />
    </div>

    <div
      class="hidden md:flex items-center justify-around w-[300px] max-w-sm gap-6 p-2 bg-white rounded-lg"
    >
      <div class="relative group">
        <svg
          @click="goToCart"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 text-gray-700 transition-transform group-hover:scale-110 cursor-pointer"
          viewBox="0 0 16 16"
        >
          <path
            fill="currentColor"
            d="M5 6.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zm3 0a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-.5-.5"
          />
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M13.5 4H3.3l-.264-1.58a.496.496 0 0 0-.493-.418h-1a.5.5 0 0 0-.5.5a.5.5 0 0 0 .5.5h.576l1.43 8.58a.496.496 0 0 0 .493.418h8.5a.5.5 0 0 0 0-1h-8.08l-.167-1h8.74a1 1 0 0 0 .992-.876l.491-3.93a1 1 0 0 0-.978-1.195zM3.4 5l.664 4h8.92l.5-4h-10.1z"
            clip-rule="evenodd"
          />
          <path
            fill="currentColor"
            d="M3.62 12.9a1.25 1.25 0 1 1 1.768 1.769A1.25 1.25 0 0 1 3.62 12.9m7.98 0a1.25 1.25 0 1 1 1.768 1.769A1.25 1.25 0 0 1 11.6 12.9"
          />
        </svg>
        <span
          v-if="countAll > 0"
          class="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
        >
          {{ countAll }}
        </span>
      </div>

      <div class="relative group">
        <svg
          @click="goToOrders"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 text-gray-700 transition-transform group-hover:scale-110 cursor-pointer"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m17.371 19.827l2.84-2.796l-.626-.627l-2.214 2.183l-.956-.975l-.627.632l1.583 1.583ZM6.77 8.73h10.462v-1H6.769v1ZM18 22.115q-1.671 0-2.836-1.164T14 18.115q0-1.67 1.164-2.835T18 14.115q1.671 0 2.836 1.165T22 18.115q0 1.672-1.164 2.836Q19.67 22.115 18 22.115ZM4 20.77V4h16v7.56q-.244-.09-.485-.154q-.24-.064-.515-.1V5H5v14.05h6.344q.068.41.176.802q.109.392.303.748l-.035.035l-1.134-.827l-1.346.961l-1.346-.961l-1.347.961l-1.346-.961L4 20.769Zm2.77-4.5h4.709q.056-.275.138-.515q.083-.24.193-.485H6.77v1Zm0-3.769h7.31q.49-.387 1.05-.645q.56-.259 1.197-.355H6.769v1ZM5 19.05V5v14.05Z"
          />
        </svg>
      </div>

      <div class="relative group">
        <svg
          @click="goToFavorites"
          xmlns="http://www.w3.org/2000/svg"
          class="h-7 text-gray-700 transition-transform group-hover:scale-110 cursor-pointer"
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
        <span
          v-if="favorites.length > 0"
          class="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow"
        >
          {{ favorites.length }}
        </span>
      </div>

      <div v-if="!auth.isLoggedIn" class="flex gap-3">
        <button
          class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          @click="signUp"
          title="Sign Up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 212 212"
            class="h-6"
          >
            <path
              id="path"
              d="M 94.43 101.71 C 104.598 101.712 114.471 98.26 122.422 91.922 C 130.373 85.584 135.939 76.729 138.203 66.816 C 140.467 56.903 139.297 46.51 134.887 37.348 C 130.476 28.187 123.081 20.79 113.921 16.377 C 104.76 11.965 94.367 10.793 84.454 13.055 C 74.541 15.317 65.684 20.881 59.344 28.83 C 53.005 36.78 49.55 46.652 49.55 56.82 C 49.563 68.715 54.299 80.132 62.709 88.544 C 71.119 96.956 82.535 101.694 94.43 101.71 Z M 94.43 25.26 C 101.579 25.258 108.52 27.684 114.111 32.14 C 119.701 36.596 123.615 42.821 125.207 49.79 C 126.799 56.759 125.978 64.067 122.877 70.508 C 119.777 76.95 114.578 82.15 108.137 85.253 C 101.697 88.355 94.39 89.179 87.42 87.589 C 80.45 85.999 74.224 82.087 69.766 76.498 C 65.309 70.91 62.88 63.969 62.88 56.82 C 62.891 48.458 66.22 40.433 72.132 34.519 C 78.044 28.605 86.068 25.273 94.43 25.26 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_1"
              d="M 94.43 118.88 C 42.93 118.88 17.86 139.88 7.51 152.41 C 2.684 158.273 0.046 165.636 0.05 173.23 L 0.05 181.32 C 0.055 186.448 2.097 191.37 5.723 194.997 C 9.35 198.623 14.272 200.665 19.4 200.67 L 169.47 200.67 C 174.598 200.665 179.52 198.623 183.147 194.997 C 186.773 191.37 188.815 186.448 188.82 181.32 L 188.82 173.23 C 188.824 165.636 186.186 158.273 181.36 152.41 C 171 139.89 145.94 118.88 94.43 118.88 Z M 175.49 181.32 C 175.49 182.911 174.857 184.438 173.733 185.563 C 172.608 186.687 171.081 187.32 169.49 187.32 L 19.4 187.32 C 17.809 187.32 16.282 186.687 15.157 185.563 C 14.033 184.438 13.4 182.911 13.4 181.32 L 13.4 173.23 C 13.392 168.738 14.948 164.381 17.8 160.91 C 26.67 150.19 48.41 132.21 94.45 132.21 C 140.49 132.21 162.24 150.21 171.11 160.91 C 173.957 164.383 175.513 168.739 175.51 173.23 Z"
              fill="currentColor"
            ></path>
            <path
              id="path_2"
              d="M 205.88 48 L 194.16 48 L 194.16 36.27 C 194.216 34.827 193.802 33.405 192.981 32.218 C 192.16 31.03 190.975 30.141 189.605 29.684 C 188.236 29.228 186.754 29.228 185.385 29.684 C 184.015 30.141 182.83 31.03 182.009 32.218 C 181.188 33.405 180.774 34.827 180.83 36.27 L 180.83 48 L 169.11 48 C 167.388 48.067 165.756 48.799 164.561 50.041 C 163.366 51.283 162.698 52.941 162.698 54.665 C 162.698 56.389 163.366 58.047 164.561 59.289 C 165.756 60.531 167.388 61.263 169.11 61.33 L 180.83 61.33 L 180.83 73 C 180.774 74.443 181.188 75.865 182.009 77.052 C 182.83 78.24 184.015 79.129 185.385 79.586 C 186.754 80.042 188.236 80.042 189.605 79.586 C 190.975 79.129 192.16 78.24 192.981 77.052 C 193.802 75.865 194.216 74.443 194.16 73 L 194.16 61.32 L 205.88 61.32 C 207.323 61.376 208.745 60.962 209.932 60.141 C 211.12 59.32 212.009 58.135 212.466 56.765 C 212.922 55.396 212.922 53.914 212.466 52.545 C 212.009 51.175 211.12 49.99 209.932 49.169 C 208.745 48.348 207.323 47.934 205.88 47.99 Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <button
          class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          @click="signIn"
          title="Sign In"
        >
          <svg
            class="h-6 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-width="1.5"
            >
              <path
                d="M8 16c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862M8 8c0-2.828 0-4.243.879-5.121C9.757 2 11.172 2 14 2h1c2.828 0 4.243 0 5.121.879C21 3.757 21 5.172 21 8v8c0 2.828 0 4.243-.879 5.121c-.768.769-1.946.865-4.121.877M3 9.5v5c0 2.357 0 3.535.732 4.268c.732.732 1.911.732 4.268.732M3.732 5.232C4.464 4.5 5.643 4.5 8 4.5"
              />
              <path
                stroke-linejoin="round"
                d="M6 12h9m0 0l-2.5 2.5M15 12l-2.5-2.5"
              />
            </g>
          </svg>
        </button>
      </div>
      <div v-else class="relative">
        <button
          @click="togleMenu"
          class="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8 text-gray-700"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-md"
        >
          <ul class="text-sm">
            <li class="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-t-lg">
              My Profile
            </li>
            <li
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-b-lg"
              @click="logout"
            >
              Log Out
            </li>
          </ul>
        </div>
      </div>
    </div>

    <transition name="slide">
      <div
        v-if="menuOpen"
        class="fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 flex flex-col"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <h2 class="text-base font-semibold text-gray-700">Menu</h2>
          <button
            @click="menuOpen = false"
            class="p-2 rounded-full hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          <div class="border-b pb-4">
            <CategoryList />
          </div>

          <div class="flex flex-col gap-3">
            <button
              @click="goToCart"
              class="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span class="flex items-center gap-2 text-gray-700">
                🛒 <span>Cart</span>
              </span>
              <span
                v-if="countAll > 0"
                class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {{ countAll }}
              </span>
            </button>

            <button
              @click="goToFavorites"
              class="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span class="flex items-center gap-2 text-gray-700">
                ❤️ <span>Favorites</span>
              </span>
              <span
                v-if="favorites.length > 0"
                class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                {{ favorites.length }}
              </span>
            </button>

            <button
              @click="goToOrders"
              class="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <span class="flex items-center gap-2 text-gray-700">
                📦 <span>Orders</span>
              </span>
            </button>
          </div>

          <div class="mt-6">
            <div v-if="!auth.isLoggedIn" class="flex gap-3">
              <button
                @click="signUp"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </button>
              <button
                @click="signIn"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
              >
                Sign In
              </button>
            </div>
            <div v-else>
              <button
                @click="logout"
                class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
import { useAuthStore } from "../stores/authStore";
import CategoryList from "./CategoryList.vue";
import { useFavoriteStore } from "../stores/favoriteStore";
import { useCartStore } from "../stores/cartStore";

const cart = useCartStore();
const countAll = computed(() => cart.countAll);

const favorite = useFavoriteStore();
const favorites = computed(() => favorite.favorites);
const auth = useAuthStore();
const emit = defineEmits(["products"]);

const router = useRouter();
const showMenu = ref(false);
const menuOpen = ref(false);

const logout = () => {
  showMenu.value = false;
  auth.logout();
  router.push("/");
};

const togleMenu = () => {
  showMenu.value = !showMenu.value;
};

const signIn = () => {
  router.push("/login");
  menuOpen.value = false;
};
const signUp = () => {
  router.push("/register");
  menuOpen.value = false;
};

const goToFavorites = () => {
  router.push("/favorite");
  menuOpen.value = false;
};
const goToCart = () => {
  router.push("/cart");
  menuOpen.value = false;
};
const goToOrders = () => {
  router.push("/orders");
  menuOpen.value = false;
};
</script>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
