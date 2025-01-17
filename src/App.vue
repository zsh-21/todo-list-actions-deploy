<script setup lang="ts">
import { ref, watch } from "vue";
import type { Todo } from "./types/todo";

const newTodo = ref("");
const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos") || "[]"));

// 监听todos的变化并保存到localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  },
  { deep: true }
);

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      completed: false,
    });
    newTodo.value = "";
  }
};

const toggleTodo = (todo: Todo) => {
  todo.completed = !todo.completed;
};

const removeTodo = (id: number) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-center mb-6">待办事项清单</h1>

      <div class="flex mb-4">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          type="text"
          placeholder="添加新的待办事项..."
          class="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:border-blue-500"
        />
        <button
          @click="addTodo"
          class="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none"
        >
          添加
        </button>
      </div>

      <ul class="space-y-2">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
        >
          <div class="flex items-center">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo)"
              class="mr-3"
            />
            <span :class="{ 'line-through text-gray-500': todo.completed }">
              {{ todo.text }}
            </span>
          </div>
          <button
            @click="removeTodo(todo.id)"
            class="text-red-500 hover:text-red-700"
          >
            删除
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
