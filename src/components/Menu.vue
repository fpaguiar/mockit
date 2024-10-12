<script setup lang="ts">
import router from "@/router";
import { RouterLink } from "vue-router";

const routes = router.getRoutes();
</script>

<template>
  <nav class="navbar bg-base-100">
    <div class="navbar-start"></div>
    <div class="navbar-center">
      <RouterLink
        class="btn btn-ghost btn-sm"
        v-for="route in routes"
        :key="route.name"
        :to="route.path"
      >
        {{ route.name }}
      </RouterLink>
    </div>
    <div class="navbar-end"></div>
  </nav>
</template>
