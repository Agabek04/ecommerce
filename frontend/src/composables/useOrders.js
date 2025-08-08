import { ref } from "vue";
import api from "./api";

export function useOrder() {
  const error = ref(null);
  const message = ref("");
  const token = localStorage.getItem("token");
  const orders = ref([]);
  const createOrder = async (
    name,
    phone_number,
    address,
    note,
    payment_type,
    items
  ) => {
    error.value = null;
    try {
      const result = await api.post(
        "/order/add",
        {
          name,
          phone_number,
          address,
          note,
          payment_type,
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.value = result.data?.message;
      return result.data.order;
    } catch (err) {
      error.value = err.response?.data?.message;
    }
  };

  const getOrders = async () => {
    error.value = null;
    try {
      const res = await api.get("/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.value = res.data?.message;
      orders.value = res.data.orders;
      return orders.value;
    } catch (err) {
      error.value = err.response?.data?.message;
    }
  };
  const updateOrder = async (order_id, status) => {
    error.value = null;
    try {
      await api.put("/order", {
        order_id,
        status,
      });
    } catch (err) {
      error.value = err.response?.data?.message;
    }
  };

  return {
    createOrder,
    getOrders,
    updateOrder,
    orders,
    error,
    message,
  };
}
