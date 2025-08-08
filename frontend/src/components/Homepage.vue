<template>
  <div class="p-10">
    <div v-if="loading" class="text-center py-10 text-gray-500 animate-pulse text-2xl">
      Loading...
    </div>

    <div v-else>
      <Category
        v-for="category in visibleCategories"
        :key="category.id"
        :category="category"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Category from "./Category.vue";
import { useCategory } from "../composables/useCategory";

const { getCategories, loading } = useCategory();
const allCategories = ref([]);
const visibleCategories = ref([]);

async function fetchCategories() {
  allCategories.value = await getCategories();
  visibleCategories.value = [];

  for (let i = 0; i < allCategories.value.length; i++) {
    visibleCategories.value.push(allCategories.value[i]);
    await new Promise((resolve) => setTimeout(resolve, 800)); 
  }
}

fetchCategories();
</script>
