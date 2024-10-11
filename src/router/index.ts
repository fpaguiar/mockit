import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PersonalInfoView from "@/views/PersonalInfoView.vue";
import AddressView from "@/views/AddressView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/personal_info",
      name: "personal_info",
      component: PersonalInfoView,
    },
    {
      path: "/address",
      name: "address",
      component: AddressView,
    },
  ],
});

export default router;
