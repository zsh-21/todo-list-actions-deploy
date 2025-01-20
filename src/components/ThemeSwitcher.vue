<script setup lang="ts">
type ThemeMode = "light" | "dark" | "system";

defineProps<{
  isDark: boolean;
  themeMode: ThemeMode;
  updateTheme: (mode: ThemeMode) => void;
}>();
</script>

<template>
  <div class="fixed top-4 right-4 flex gap-2 z-50">
    <!-- 手动切换按钮 -->
    <button
      @click="updateTheme(isDark ? 'light' : 'dark')"
      class="p-2 rounded-lg transition-colors duration-300 dark:bg-gray-700 bg-white/70 backdrop-blur shadow-lg hover:shadow-xl"
      v-if="themeMode !== 'system'"
    >
      <!-- 月亮图标（深色模式） -->
      <svg
        v-if="!isDark"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
      <!-- 太阳图标（浅色模式） -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-yellow-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>

    <!-- 系统切换按钮 -->
    <button
      @click="
        updateTheme(
          themeMode === 'system' ? (isDark ? 'light' : 'dark') : 'system'
        )
      "
      class="p-2 rounded-lg transition-colors duration-300 dark:bg-gray-700 bg-white/70 backdrop-blur shadow-lg hover:shadow-xl"
      :class="{ 'text-blue-600 dark:text-blue-400': themeMode === 'system' }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </button>
  </div>
</template>
