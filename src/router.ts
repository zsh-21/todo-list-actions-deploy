import { createRouter, createWebHistory } from "vue-router";
import TodoList from "./components/TodoList.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: TodoList,
    },
  ],
});

export default router;
