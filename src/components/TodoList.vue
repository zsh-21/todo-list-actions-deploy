<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "../types/todo";
import TodoItem from "./TodoItem.vue";
import TodoFilter from "./TodoFilter.vue";

const props = defineProps<{
  todos: Todo[];
  filteredTodos: Todo[];
  filter: "all" | "active" | "completed";
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: "update:filter", value: "all" | "active" | "completed"): void;
  (e: "update:searchQuery", value: string): void;
  (e: "addTodo", text: string): void;
  (e: "toggleTodo", todo: Todo): void;
  (e: "removeTodo", id: number): void;
  (e: "removeTodos", ids: number[]): void;
  (e: "updateTodo", todo: Todo, text: string): void;
}>();

const newTodo = ref("");
const selectedTodos = ref<Set<number>>(new Set());

const addTodo = () => {
  if (newTodo.value.trim()) {
    emit("addTodo", newTodo.value);
    newTodo.value = "";
  }
};

const toggleSelect = (id: number) => {
  if (selectedTodos.value.has(id)) {
    selectedTodos.value.delete(id);
  } else {
    selectedTodos.value.add(id);
  }
};

const removeSelected = () => {
  if (selectedTodos.value.size > 0) {
    emit("removeTodos", Array.from(selectedTodos.value));
    selectedTodos.value.clear();
  }
};
</script>

<template>
  <div
    class="max-w-2xl mx-auto dark:bg-gray-800/80 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-8"
  >
    <h1
      class="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
    >
      待办事项清单
    </h1>

    <div class="space-y-4 sm:space-y-6">
      <!-- 搜索和过滤区 -->
      <TodoFilter
        :filter="filter"
        :search-query="searchQuery"
        @update:filter="emit('update:filter', $event)"
        @update:search-query="emit('update:searchQuery', $event)"
      />

      <!-- 添加新待办 -->
      <div class="flex gap-2">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          type="text"
          placeholder="添加新的待办事项..."
          class="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          @click="addTodo"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 font-medium"
        >
          添加
        </button>
      </div>

      <!-- 批量删除按钮 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-2 max-h-0 overflow-hidden"
        enter-to-class="opacity-100 transform translate-y-0 max-h-20 overflow-hidden"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 max-h-20 overflow-hidden"
        leave-to-class="opacity-0 transform -translate-y-2 max-h-0 overflow-hidden"
      >
        <div
          v-if="selectedTodos.size > 0"
          class="flex justify-between items-center px-4 py-2 bg-red-50 dark:bg-red-900/30 rounded-lg"
        >
          <span class="text-red-600 dark:text-red-400">
            已选择 {{ selectedTodos.size }} 项
          </span>
          <button
            @click="removeSelected"
            class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            删除选中项
          </button>
        </div>
      </Transition>

      <!-- 待办列表 -->
      <ul class="space-y-2.5">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          :is-selected="selectedTodos.has(todo.id)"
          @toggle="emit('toggleTodo', $event)"
          @remove="emit('removeTodo', $event)"
          @update="emit('updateTodo', todo, $event)"
          @select="toggleSelect(todo.id)"
        />
      </ul>

      <!-- 统计信息 -->
      <div class="text-sm text-gray-500 text-center pt-2">
        总计 {{ todos.length }} 项 / 已完成
        {{ todos.filter((t) => t.completed).length }} 项 / 未完成
        {{ todos.filter((t) => !t.completed).length }} 项
      </div>
    </div>
  </div>
</template>
