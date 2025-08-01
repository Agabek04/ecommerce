<template>
  <div class="font-mono">
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from "./components/Navbar.vue";
</script>