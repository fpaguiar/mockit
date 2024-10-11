<script setup lang="ts">
import { RouterView } from "vue-router";
import Menu from "@/components/Menu.vue";
</script>

<template>
  <div class="flex space-x-4">
    <Menu class="max-w-80" />
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
