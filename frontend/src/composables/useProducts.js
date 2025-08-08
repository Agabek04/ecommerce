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
    const start = Date.now();
    try {
      const result = await api.get("/products", {
        params: { categoryName, name, id, limit, page },
      });
      products.value = result.data.products;
    } catch (err) {
      error.value = err.response?.data?.message || "Error fetching products";
    } finally {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, 2000 - elapsed);
      setTimeout(() => {
        loading.value = false;
      }, delay);
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
