<template>
  <div class="px-4 sm:px-6">
    <div class="h-screen pt-16">
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
  </div>
</template>

<script setup lang="ts">
import TodoList from "../../components/TodoList.vue";
import type { Todo } from "../../types/todo";
import { computed, ref, watch } from "vue";

const searchQuery = ref("");
const filter = ref<"all" | "active" | "completed">("all");

const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos") || "[]"));

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
</script>
