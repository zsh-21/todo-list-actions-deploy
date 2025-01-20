<script setup lang="ts">
const links = [
  { name: "待办事项", icon: "📝", path: "/" },
  { name: "百度", icon: "🔍", path: "https://www.baidu.com" },
  { name: "GitHub", icon: "📦", path: "https://github.com" },
  { name: "掘金", icon: "💎", path: "https://juejin.cn" },
  { name: "Vue文档", icon: "📚", path: "https://cn.vuejs.org" },
];

const emit = defineEmits(["close", "select"]);

const openLink = (path: string) => {
  emit("select", path);
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
    @click="emit('close')"
  >
    <div
      class="w-64 h-full bg-white dark:bg-gray-800 shadow-xl absolute left-0 top-0"
      @click.stop
    >
      <div class="p-4 border-b dark:border-gray-700">
        <h2 class="text-lg font-semibold dark:text-white">导航菜单</h2>
      </div>

      <nav class="p-4">
        <ul class="space-y-2">
          <li v-for="link in links" :key="link.name">
            <button
              @click="openLink(link.path)"
              class="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              <span class="text-xl">{{ link.icon }}</span>
              <span>{{ link.name }}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
