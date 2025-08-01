<template>
  <div class="p-10">
    <Category v-for="category in categories" :key="category.id" :category="category"/>
  </div>

</template>

<script setup>
import Category from "./Category.vue";
import { useCategory } from "../composables/useCategory";
import { ref } from "vue";
const { getCategories } = useCategory();
const categories =ref([])
async function getCategory() {
  categories.value = await getCategories()
}

getCategory()
</script>