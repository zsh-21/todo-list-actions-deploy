<script setup lang="ts">
const links = [
  { name: "待办事项", icon: "📝", path: "/todo-page" },
  { name: "生日快乐", icon: "🍬", path: "/birthday-page" },
  { name: "百度", icon: "🔍", path: `/outer-page?pathKey=baidu` },
  { name: "GitHub", icon: "📦", path: `/outer-page?pathKey=github` },
  { name: "掘金", icon: "💎", path: `/outer-page?pathKey=juejin` },
  { name: "Vue文档", icon: "📚", path: `/outer-page?pathKey=vuejs` },
];

const emit = defineEmits(["close", "select"]);

const openLink = (path: string) => {
  emit("select", path);
  emit("close");
};
</script>

<template>
  <div class="w-64 h-full bg-white dark:bg-gray-800 shadow-xl absolute left-0 top-0" @click.stop>
    <div class="p-4 border-b dark:border-gray-700">
      <h2 class="text-lg font-semibold dark:text-white">导航菜单</h2>
    </div>

    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="link in links" :key="link.name">
          <button
            class="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            @click="openLink(link.path)"
          >
            <span class="text-xl">{{ link.icon }}</span>
            <span>{{ link.name }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>
