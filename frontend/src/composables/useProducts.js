import { ref } from "vue";
import api from "./api";

export function useProduct() {
  const error = ref(null);
  const products = ref([]);
  const loading = ref(false);
  const message = ref("");
  const token = localStorage.getItem("token");

  const addProduct = async (formData) => {
    try {
      const res = await api.post("/admin/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Error adding product";
      throw err;
    }
  };

  const getProduct = async ({ categoryName, name, id, limit, page } = {}) => {
    error.value = null;
    loading.value = true;
    try {
      const result = await api.get("/products", {
        params: { categoryName, name, id, limit, page },
      });
      products.value = result.data;
      return products.value;
    } catch (err) {
      error.value = err.response?.data?.message || "Error fetching products";
    } finally {
      loading.value = false;
    }
  };

  return {
    addProduct,
    getProduct,
    products,
    error,
    loading,
    message,
  };
}
