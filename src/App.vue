<script setup lang="ts">
import { RouterView } from "vue-router";
import Menu from "@/components/Menu.vue";
</script>

<template>
  <Menu />
  <div class="container mx-auto">
    <RouterView />
  </div>
</template>

<style scoped></style>
