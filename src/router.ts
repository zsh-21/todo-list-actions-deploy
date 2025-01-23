import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./App.vue"),
      redirect: "/todo-page",
      children: [
        {
          path: "/todo-page",
          name: "todoPage",
          component: () => import("./pages/TodoList/index.vue"),
        },
        {
          path: "/outer-page",
          name: "outerPage",
          component: () => import("./pages/OuterPage/index.vue"),
        },
        {
          path: "/birthday-page",
          name: "birthDayPage",
          component: () => import("./pages/Birthday/index.vue"),
        },
      ],
    },
  ],
});

export default router;
