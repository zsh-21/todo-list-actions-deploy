<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import router from "./router";

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

// 侧边栏状态
const isSidebarOpen = ref(false);

const handleLinkSelect = (path: string) => {
  router.push(path);
  isSidebarOpen.value = false;
};
</script>

<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
    ]"
  >
    <div v-if="!isSidebarOpen" class="fixed top-4 left-4 z-50">
      <button
        class="p-2 rounded-lg transition-colors duration-300 dark:bg-gray-700 bg-white/70 backdrop-blur shadow-lg hover:shadow-xl"
        :class="{ 'bg-[#7a1121] text-[#f6acac]': $route.path === '/birthday-page' }"
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

    <router-view></router-view>
  </div>
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
