<template>
  <div class="px-4 sm:px-6">
    <div class="h-screen pt-16">
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const pathMap = {
  baidu: `https://www.baidu.com`,
  github: `https://github.com`,
  juejin: `https://juejin.cn`,
  vuejs: `https://cn.vuejs.org`,
};

const currentPath = ref("/");

const isLoading = ref(false);
const route = useRoute();
watch(
  () => route.query,
  (newQuery) => {
    console.log(newQuery, "newQuery");
    isLoading.value = true;
    currentPath.value = pathMap[newQuery.pathKey as keyof typeof pathMap];
  },
  { immediate: true }
);
</script>
