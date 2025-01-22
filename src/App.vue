<script setup lang="ts">
import { ref, watch } from "vue";
import type { Todo } from "./types/todo";
import BirthdayWish from "./components/BirthdayWish.vue";
// import Sidebar from "./components/Sidebar.vue";
// import ThemeSwitcher from "./components/ThemeSwitcher.vue";
// import TodoList from "./components/TodoList.vue";

// const searchQuery = ref("");
// const filter = ref<"all" | "active" | "completed">("all");
const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos") || "[]"));

// 主题模式类型
type ThemeMode = "light" | "dark" | "system";

// 主题设置
const themeMode = ref<ThemeMode>((localStorage.getItem("theme-mode") as ThemeMode) || "system");
const isDark = ref(false);

// 更新主题状态
const updateTheme = (mode: ThemeMode) => {
  themeMode.value = mode;
  localStorage.setItem("theme-mode", mode);

  if (mode === "system") {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark.value = mode === "dark";
  }

  document.documentElement.classList.toggle("dark", isDark.value);
};

// 初始化主题
updateTheme(themeMode.value);

// 监听系统主题变化
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (themeMode.value === "system") {
    isDark.value = e.matches;
    document.documentElement.classList.toggle("dark", e.matches);
  }
});

// 监听todos的变化并保存到localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  },
  { deep: true }
);

// const filteredTodos = computed(() => {
//   return todos.value
//     .filter((todo) => {
//       if (filter.value === "active") return !todo.completed;
//       if (filter.value === "completed") return todo.completed;
//       return true;
//     })
//     .filter((todo) => todo.text.toLowerCase().includes(searchQuery.value.toLowerCase()));
// });

// // Todo 操作方法
// const addTodo = (text: string) => {
//   const now = new Date().toISOString();
//   todos.value.unshift({
//     id: Date.now(),
//     text,
//     completed: false,
//     createdAt: now,
//     updatedAt: now,
//   });
// };

// const toggleTodo = (todo: Todo) => {
//   todo.completed = !todo.completed;
// };

// const removeTodo = (id: number) => {
//   todos.value = todos.value.filter((todo) => todo.id !== id);
// };

// const updateTodo = (todo: Todo, text: string) => {
//   todo.text = text;
//   todo.updatedAt = new Date().toISOString();
// };

// // 添加批量删除方法
// const removeTodos = (ids: number[]) => {
//   todos.value = todos.value.filter((todo) => !ids.includes(todo.id));
// };

// // 侧边栏状态
// const isSidebarOpen = ref(false);
// const currentPath = ref("/");
// const isLoading = ref(false);

// const handleLinkSelect = (path: string) => {
//   currentPath.value = path;
//   isSidebarOpen.value = false;
//   if (path !== "/") {
//     isLoading.value = true;
//   }
// };

// // 添加显示生日页面的状态
// const showBirthday = ref(true);

// // 添加切换显示的方法
// const toggleView = () => {
//   showBirthday.value = !showBirthday.value;
// };
</script>

<template>
  <BirthdayWish />
  <!-- <div
    v-else
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
    ]"
  >
    <button
      class="fixed top-4 right-4 z-50 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
      @click="toggleView"
    >
      🎂 生日模式
    </button>

    <div v-if="!isSidebarOpen" class="fixed top-4 left-4 z-50">
      <button
        class="p-2 rounded-lg transition-colors duration-300 dark:bg-gray-700 bg-white/70 backdrop-blur shadow-lg hover:shadow-xl"
        @click="isSidebarOpen = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <div
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-[width] duration-0 w-full"
      :class="{
        '!w-0': !isSidebarOpen,
        'delay-200': !isSidebarOpen,
        'bg-black/0': !isSidebarOpen,
      }"
      @click="isSidebarOpen = false"
    >
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-x-[-100%]"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-[-100%]"
      >
        <Sidebar v-if="isSidebarOpen" @select="handleLinkSelect" />
      </Transition>
    </div>

    <ThemeSwitcher :is-dark="isDark" :theme-mode="themeMode" :update-theme="updateTheme" />

    <div class="px-4 sm:px-6">
      <div v-if="currentPath === '/'">
        <TodoList
          :todos="todos"
          :filtered-todos="filteredTodos"
          :filter="filter"
          :search-query="searchQuery"
          @update:filter="filter = $event"
          @update:search-query="searchQuery = $event"
          @add-todo="addTodo"
          @toggle-todo="toggleTodo"
          @remove-todo="removeTodo"
          @remove-todos="removeTodos"
          @update-todo="updateTodo"
        />
      </div>

      <div v-else class="h-screen pt-16">
        <div
          v-if="isLoading"
          class="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm z-30"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"
          ></div>
        </div>

        <iframe
          :src="currentPath"
          class="w-full h-full rounded-xl shadow-xl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          @load="isLoading = false"
        ></iframe>
      </div>
    </div>
  </div> -->
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
