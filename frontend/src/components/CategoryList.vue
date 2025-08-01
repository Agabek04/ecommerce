<template>
  <div class="relative inline-block">
    <button
      @click="toggleCategory"
      class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition text-lg font-medium shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="w-5 h-5 text-gray-600"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      Categories
      <svg
        :class="{ 'rotate-180': show }"
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <transition name="fade">
      <div
        v-if="show"
        class="absolute mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden"
      >
        <ul class="max-h-60 overflow-y-auto">
          <li
            v-for="category in categories"
            :key="category.id"
            class="border-b last:border-none"
          >
            <button
              @click="gotoCategory(category)"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-base transition"
            >
              {{ category.name }}
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCategory } from "../composables/useCategory";
import { useRouter } from "vue-router";

const router = useRouter();
const { getCategories, categories } = useCategory();
getCategories();

const show = ref(false);
function toggleCategory() {
  show.value = !show.value;
}
const gotoCategory = (cat) => {
  show.value = false;
  router.push({ name: "products", query: { category: cat.name } });
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
