<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-4xl font-extrabold text-center mb-10 text-gray-900">
      Admin Panel
    </h1>

    <div class="flex justify-center gap-6 mb-8">
      <button
        :class="tab === 'categories' ? activeTabClass : tabClass"
        @click="tab = 'categories'"
      >
        Categories
      </button>
      <button
        :class="tab === 'products' ? activeTabClass : tabClass"
        @click="tab = 'products'"
      >
        Products
      </button>
      <button
        :class="tab === 'orders' ? activeTabClass : tabClass"
        @click="tab = 'orders'"
      >
        Orders
      </button>
    </div>

    <section
      v-if="tab === 'categories'"
      class="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8"
    >
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">
        Manage Categories
      </h2>

      <div class="flex gap-3 mb-6">
        <input
          v-model="newCategory"
          placeholder="Category name"
          class="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
        <button
          @click="addCategory"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      <table class="w-full border-collapse text-gray-700">
        <thead>
          <tr class="bg-blue-50 border-b border-gray-300">
            <th class="py-3 px-5 text-left font-semibold">ID</th>
            <th class="py-3 px-5 text-left font-semibold">Name</th>
            <th class="py-3 px-5 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categories"
            :key="category.id"
            class="border-b hover:bg-gray-100 transition"
          >
            <td class="py-3 px-5">{{ category.id }}</td>
            <td class="py-3 px-5">
              <input
                v-if="editCategoryId === category.id"
                v-model="editCategoryName"
                class="border border-gray-300 rounded px-3 py-1 w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              />
              <span v-else>{{ category.name }}</span>
            </td>
            <td class="py-3 px-5 flex justify-center gap-3">
              <button
                v-if="editCategoryId === category.id"
                @click="updateCategory(category.id)"
                class="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
                title="Save"
              >
                Save
              </button>
              <button
                v-else
                @click="startEditCategory(category)"
                class="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500 transition"
                title="Edit"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                title="Delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section
      v-else-if="tab === 'products'"
      class="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8"
    >
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Manage Products</h2>

      <form
        @submit.prevent="isEditing ? updateProduct() : addProduct()"
        class="space-y-5 mb-8"
      >
        <input
          v-model="newProduct.name"
          placeholder="Product name"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        />
        <textarea
          v-model="newProduct.description"
          placeholder="Description"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          rows="4"
          required
        ></textarea>
        <div class="grid grid-cols-2 gap-5">
          <input
            v-model.number="newProduct.price"
            placeholder="Price"
            type="number"
            class="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            min="0"
            step="0.01"
            required
          />
          <input
            v-model.number="newProduct.stock"
            placeholder="Stock"
            type="number"
            class="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            min="0"
            required
          />
        </div>

        <select
          v-model="newProduct.categoryName"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        >
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">
            {{ cat.name }}
          </option>
        </select>

        <div class="flex flex-col gap-3">
          <label class="font-semibold text-gray-700">Main Image:</label>
          <input
            type="file"
            @change="onMainImageChange"
            accept="image/*"
            class="border border-gray-300 rounded-md p-2 cursor-pointer"
          />
        </div>

        <div class="flex flex-col gap-3">
          <label class="font-semibold text-gray-700">Gallery Images:</label>
          <input
            type="file"
            multiple
            @change="onGalleryChange"
            accept="image/*"
            class="border border-gray-300 rounded-md p-2 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {{ isEditing ? "Update Product" : "Add Product" }}
        </button>

        <button
          v-if="isEditing"
          type="button"
          @click="cancelEdit"
          class="ml-3 bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </form>

      <table class="w-full border-collapse text-gray-700">
        <thead>
          <tr class="bg-blue-50 border-b border-gray-300">
            <th class="py-3 px-5 text-left font-semibold">ID</th>
            <th class="py-3 px-5 text-left font-semibold">Name</th>
            <th class="py-3 px-5 text-left font-semibold">Price</th>
            <th class="py-3 px-5 text-left font-semibold">Stock</th>
            <th class="py-3 px-5 text-left font-semibold">Category</th>
            <th class="py-3 px-5 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b hover:bg-gray-100 transition"
          >
            <td class="py-3 px-5">{{ product.id }}</td>
            <td class="py-3 px-5">{{ product.name }}</td>
            <td class="py-3 px-5">
              {{ Math.round(product.price * 100) / 100 }}tmt
            </td>
            <td class="py-3 px-5">{{ product.stock }}</td>
            <td class="py-3 px-5">{{ product.category_id }}</td>
            <td class="py-3 px-5 flex justify-center gap-3">
              <button
                @click="editProduct(product)"
                class="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section
      v-else
      class="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8"
    >
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Manage Orders</h2>

      <table class="w-full border-collapse text-gray-700">
        <thead>
          <tr class="bg-blue-50 border-b border-gray-300">
            <th class="py-3 px-5 text-left font-semibold">ID</th>
            <th class="py-3 px-5 text-left font-semibold">Name</th>
            <th class="py-3 px-5 text-left font-semibold">Phone</th>
            <th class="py-3 px-5 text-left font-semibold">Status</th>
            <th class="py-3 px-5 text-left font-semibold">Total</th>
            <th class="py-3 px-5 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b hover:bg-gray-100 transition"
          >
            <td class="py-3 px-5">{{ order.id }}</td>
            <td class="py-3 px-5">{{ order.name || "Unknown User" }}</td>
            <td class="py-3 px-5">{{ order.phone_number }}</td>
            <td class="py-3 px-5">
              {{ order.status }}
            </td>
            <td class="py-3 px-5">
              {{ Math.round(order.total_price * 100) / 100 }}tmt
            </td>
            <td class="py-3 px-5 flex justify-center gap-3">
              <button
                @click="viewOrderDetails(order)"
                class="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                View
              </button>
              <button
                @click="deleteOrder(order.id)"
                class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 relative"
        >
          <button
            @click="showModal = false"
            class="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>

          <h3 class="text-xl font-bold mb-4">Order #{{ selectedOrder.id }}</h3>

          <div class="space-y-2 mb-4">
            <p><strong>User:</strong> {{ selectedOrder.name }}</p>
            <p><strong>Phone:</strong> {{ selectedOrder.phone_number }}</p>
            <p><strong>Address:</strong> {{ selectedOrder.address }}</p>
            <p>
              <strong>Total Price:</strong>
              {{ Math.round(selectedOrder.total_price * 100) / 100 }}tmt
            </p>
            <p>
              <strong>Status:</strong>
              <span
                class="px-2 py-1 rounded text-white"
                :class="{
                  'bg-yellow-500': selectedOrder.status === 'pending',
                  'bg-blue-500': selectedOrder.status === 'processing',
                  'bg-purple-500': selectedOrder.status === 'shipped',
                  'bg-green-600': selectedOrder.status === 'delivered',
                  'bg-red-500': selectedOrder.status === 'cancelled',
                }"
              >
                {{ selectedOrder.status }}
              </span>
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-2">Products in this order:</h4>
            <div v-if="orderItemsLoading" class="text-gray-500 text-sm">
              Loading products...
            </div>
            <div v-else>
              <div
                v-for="item in orderItems"
                :key="item.id"
                class="flex items-center gap-3 border rounded p-2 mb-2"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  class="w-12 h-12 object-cover rounded border"
                  alt="Product image"
                />
                <div>
                  <p class="font-medium">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">
                    Price: {{ Math.round(item.price * 100) / 100 }} tmt
                  </p>
                  <p class="text-sm text-gray-600">Count: {{ item.count }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../composables/api";
import { useAuthStore } from "../stores/authStore";

const token = localStorage.getItem("token");
const tab = ref("categories");
const auth = useAuthStore();

const tabClass =
  "px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition";
const activeTabClass =
  "px-6 py-3 rounded-lg border border-blue-600 bg-blue-600 text-white shadow-md transition";

const categories = ref([]);
const newCategory = ref("");
const editCategoryId = ref(null);
const editCategoryName = ref("");
const showModal = ref(false);
const selectedOrder = ref({});
const orderItems = ref([]);
const orderItemsLoading = ref(false);
const products = ref([]);
const newProduct = ref({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryName: "",
});
const mainImage = ref(null);
const galleryImages = ref([]);

const orders = ref([]);

const fetchCategories = async () => {
  const res = await api.get("/category");
  categories.value = res.data.categories || res.data;
};

const fetchProducts = async () => {
  const res = await api.get("/products");
  products.value = res.data.products || res.data;
};

const fetchOrders = async () => {
  const res = await api.get("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  orders.value = res.data.orders || res.data;
};

const addCategory = async () => {
  if (!newCategory.value.trim()) return;
  await api.post(
    "/category/add",
    { name: newCategory.value.trim() },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  newCategory.value = "";
  fetchCategories();
};

const startEditCategory = (category) => {
  editCategoryId.value = category.id;
  editCategoryName.value = category.name;
};

const updateCategory = async (id) => {
  if (!editCategoryName.value.trim()) return;
  await api.put(
    `/category/${id}`,
    { name: editCategoryName.value.trim() },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  editCategoryId.value = null;
  fetchCategories();
};

const deleteCategory = async (id) => {
  await api.delete(`/category/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  fetchCategories();
};

const onMainImageChange = (e) => {
  mainImage.value = e.target.files[0];
};

const onGalleryChange = (e) => {
  galleryImages.value = Array.from(e.target.files);
};

const addProduct = async () => {
  if (!newProduct.value.name.trim() || !newProduct.value.categoryName.trim())
    return;
  const formData = new FormData();
  formData.append("name", newProduct.value.name);
  formData.append("description", newProduct.value.description);
  formData.append("price", newProduct.value.price);
  formData.append("stock", newProduct.value.stock);
  formData.append("categoryName", newProduct.value.categoryName);
  if (mainImage.value) formData.append("main_image", mainImage.value);
  galleryImages.value.forEach((file) => formData.append("gallery", file));

  await api.post("/product/add", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  fetchProducts();

  newProduct.value = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryName: "",
  };
  mainImage.value = null;
  galleryImages.value = [];
};

const isEditing = ref(false);
const editingProductId = ref(null);

const editProduct = (product) => {
  isEditing.value = true;
  editingProductId.value = product.id;
  newProduct.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryName: product.category_name || "",
  };
};

const cancelEdit = () => {
  isEditing.value = false;
  editingProductId.value = null;
  newProduct.value = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryName: "",
  };
  mainImage.value = null;
  galleryImages.value = [];
};

const updateProduct = async () => {
  const formData = new FormData();
  formData.append("name", newProduct.value.name);
  formData.append("description", newProduct.value.description);
  formData.append("price", newProduct.value.price);
  formData.append("stock", newProduct.value.stock);
  formData.append("categoryName", newProduct.value.categoryName);
  if (mainImage.value) formData.append("main_image", mainImage.value);
  galleryImages.value.forEach((file) => formData.append("gallery", file));

  await api.put(`/product/${editingProductId.value}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchProducts();
  cancelEdit();
};

const deleteProduct = async (id) => {
  await api.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  fetchProducts();
};

const viewOrderDetails = async (order) => {
  selectedOrder.value = { ...order };
  showModal.value = true;

  orderItemsLoading.value = true;
  try {
    const res = await api.get(`/order-items/${order.id}`);
    orderItems.value = res.data;
  } finally {
    orderItemsLoading.value = false;
  }
};

const deleteOrder = async (id) => {
  if (!confirm("Are you sure you want to delete this order?")) return;
  await api.delete(`/order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  fetchOrders();
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
  fetchOrders();

  const userRole = localStorage.getItem("userRole");
  console.log(userRole);
  if (userRole !== "admin") {
    console.log(userRole);
    router.push("/login");
  }
});
</script>
