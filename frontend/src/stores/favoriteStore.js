import { defineStore } from "pinia";

export const useFavoriteStore = defineStore("favorite", {
  state: () => ({
    favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  }),

  getters: {
    isFavorite: (state) => {
      return (product) => {
        return state.favorites.some((fav) => fav.id === product.id);
      };
    },
  },

  actions: {
    addFavorite(product) {
      this.favorites.push(product);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },

    removeFavorite(product) {
      this.favorites = this.favorites.filter(
        (fav) => fav.id !== product.id
      );
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
});
