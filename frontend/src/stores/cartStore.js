import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    products: JSON.parse(localStorage.getItem("products")) || [],
    countAll: JSON.parse(localStorage.getItem("countOfPrductsInCart")) || 0,
  }),

  getters: {
    getCount: (state) => (id) => {
      const item = state.products.find((p) => p.id === id);
      return item?.count || 0;
    },
    isInCart: (state) => (id) => {
      return state.products.some((p) => p.id === id);
    },
  },

  actions: {
    saveToStorage() {
      localStorage.setItem("products", JSON.stringify(this.products));
      localStorage.setItem(
        "countOfPrductsInCart",
        JSON.stringify(this.countAll)
      );
    },

    addToCart(product) {
      if(product.stock>0){

        const existing = this.products.find((p) => p.id === product.id);
  
        if (existing) {
          if (product.stock > existing.count) {
            existing.count++;
            this.countAll++;
          }
        } else {
          product.count = 1;
          this.products.push(product);
          this.countAll++;
        }
        this.saveToStorage();
      }

    },

    decreaseFromCart(product) {
      const existing = this.products.find((p) => p.id === product.id);

      if (existing) {
        if (existing.count > 1) {
          existing.count--;
          this.countAll--;
        } else {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.countAll--;
        }

        this.saveToStorage();
      }
    },
    removeFromCart() {
      localStorage.removeItem("products");
      this.countAll = 0;
      this.products = [];
      this.saveToStorage();
    },
  },
});
