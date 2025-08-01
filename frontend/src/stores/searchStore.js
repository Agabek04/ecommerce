import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    products: []
  }),
  actions: {
    setProducts(data) {
      this.products = data
    }
  }
})