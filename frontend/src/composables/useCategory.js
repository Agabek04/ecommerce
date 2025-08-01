import { ref } from "vue";
import api from "./api";

export function useCategory() {
  const error = ref(null);
  const categories = ref([]);
  const loading = ref(false);
  const message=ref('')
  const token = localStorage.getItem("token");
  const addCategory = async (name) => {
    error.value = null;
    try {
     const result= await api.post(
        "/category/add",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.value=result.data?.message
    } catch (err) {
      error.value = err.response?.data?.message;
    }
  };

  const getCategories = async () => {
    error.value = null;
    loading.value = true;
    try {
      const result = await api.get("/category");
      categories.value = result.data;
      return categories.value
    } catch (err) {
      error.value = err.response?.data?.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    addCategory,
    getCategories,
    categories,
    error,
    loading,
    message
  };
}
