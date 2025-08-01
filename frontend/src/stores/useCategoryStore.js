import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
  const currentCategory = ref(null);

  function setCategory(cat) {
    currentCategory.value = cat;
  }

  return {
    currentCategory,
    setCategory
  };
});
    