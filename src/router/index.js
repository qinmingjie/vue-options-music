import Layout from "@/layout/index.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: Layout,
    children: []
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

export default router;
