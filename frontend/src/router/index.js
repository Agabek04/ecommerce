import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import SignIN from "../components/SignIN.vue";
import register from "../components/register.vue";
import Admin from "../admin/admin.vue";
import SearchResults from "../components/SearchResults.vue";
import ProductInfo from "../components/ProductInfo.vue";
import Categories from "../components/Categories.vue";
import Favorite from "../components/Favorite.vue";
import Cart from "../components/Cart.vue";
import Orders from "../components/Orders.vue";
import CreateOrder from "../components/CreateOrder.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: Homepage,
    props: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: { requiresAdmin: true },
  },
  {
    path: "/login",
    name: "login",
    component: SignIN,
  },
  {
    path: "/register",
    name: "regster",
    component: register,
  },
  {
    path: "/search",
    name: "SearchResults",
    component: SearchResults,
  },
  {
    path: "/product/:id",
    name: "product",
    component: ProductInfo,
  },
  {
    path: "/products",
    name: "products",
    component: Categories,
  },
  {
    path: "/favorite",
    name: "favorite",
    component: Favorite,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/orders",
    name: "orders",
    component: Orders,
  },
  {
    path: "/createorder",
    name: "createorder",
    component: CreateOrder,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem("userRole");

  if (to.meta.requiresAdmin) {
    if (userRole === "admin") {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
