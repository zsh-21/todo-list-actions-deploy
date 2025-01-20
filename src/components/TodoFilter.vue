<script setup lang="ts">
defineProps<{
  filter: "all" | "active" | "completed";
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: "update:filter", value: "all" | "active" | "completed"): void;
  (e: "update:searchQuery", value: string): void;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <input
      :value="searchQuery"
      @input="
        emit('update:searchQuery', ($event.target as HTMLInputElement).value)
      "
      type="text"
      placeholder="搜索待办事项..."
      class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
      <button
        v-for="option in ['all', 'active', 'completed']"
        :key="option"
        @click="emit('update:filter', option as 'all' | 'active' | 'completed')"
        :class="{
          'px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm whitespace-nowrap': true,
          'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200/50 hover:shadow-lg hover:translate-y-[-1px]':
            filter === option,
          'bg-white/70 backdrop-blur text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:text-blue-600':
            filter !== option,
        }"
      >
        {{
          option === "all" ? "全部" : option === "active" ? "进行中" : "已完成"
        }}
      </button>
    </div>
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
