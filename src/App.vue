<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Todo } from "./types/todo";
import Sidebar from "./components/Sidebar.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import TodoList from "./components/TodoList.vue";

const searchQuery = ref("");
const filter = ref<"all" | "active" | "completed">("all");
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

const filteredTodos = computed(() => {
  return todos.value
    .filter((todo) => {
      if (filter.value === "active") return !todo.completed;
      if (filter.value === "completed") return todo.completed;
      return true;
    })
    .filter((todo) => todo.text.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Todo 操作方法
const addTodo = (text: string) => {
  const now = new Date().toISOString();
  todos.value.unshift({
    id: Date.now(),
    text,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
};

const toggleTodo = (todo: Todo) => {
  todo.completed = !todo.completed;
};

const removeTodo = (id: number) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const updateTodo = (todo: Todo, text: string) => {
  todo.text = text;
  todo.updatedAt = new Date().toISOString();
};

// 添加批量删除方法
const removeTodos = (ids: number[]) => {
  todos.value = todos.value.filter((todo) => !ids.includes(todo.id));
};

// 侧边栏状态
const isSidebarOpen = ref(false);
const currentPath = ref("/");
const isLoading = ref(false);

const handleLinkSelect = (path: string) => {
  currentPath.value = path;
  isSidebarOpen.value = false;
  if (path !== "/") {
    isLoading.value = true;
  }
};
</script>

<template>
  <router-view></router-view>
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
