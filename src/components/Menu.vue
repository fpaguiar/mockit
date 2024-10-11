<script setup lang="ts">
import router from "@/router";
import { RouterLink } from "vue-router";

const routes = router.getRoutes();
</script>

<template>
  <ul class="menu bg-base-200 rounded-box w-56">
    <li v-for="route in routes" :key="route.name">
      <RouterLink :to="route.path">{{ route.name }}</RouterLink>
    </li>
  </ul>
</template>
