import { createRouter, createWebHistory } from "vue-router";
// import TodoList from "./components/TodoList.vue";
import BirthdayWish from "./components/BirthdayWish.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: BirthdayWish,
    },
    {
      path: "/birthday",
      component: BirthdayWish,
    },
  ],
});

export default router;
