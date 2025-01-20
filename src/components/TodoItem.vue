<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "../types/todo";
import { vFocus } from "../directives/focus";

const props = defineProps<{
  todo: Todo;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle", todo: Todo): void;
  (e: "remove", id: number): void;
  (e: "update", text: string): void;
  (e: "select"): void;
}>();

const editingText = ref("");
const isEditing = ref(false);

const startEditing = () => {
  if (!props.todo.completed) {
    isEditing.value = true;
    editingText.value = props.todo.text;
  }
};

const saveEdit = () => {
  const text = editingText.value.trim();
  if (text && text !== props.todo.text) {
    emit("update", text);
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <li
    :class="[
      'group flex items-center justify-between p-3 sm:p-4 bg-white/70 backdrop-blur rounded-xl transition-all duration-200 border shadow-sm hover:shadow',
      isSelected
        ? 'border-blue-300 bg-blue-50/80 hover:bg-blue-100/80'
        : 'border-gray-100 hover:bg-blue-50/80 hover:border-blue-200',
    ]"
  >
    <div class="flex items-center space-x-3 min-w-0 flex-1">
      <!-- 选择框 -->
      <button
        @click="emit('select')"
        class="w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200"
        :class="[
          isSelected
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-gray-300 hover:border-blue-400',
        ]"
      >
        <svg
          v-if="isSelected"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <!-- 复选框 -->

      <div class="flex flex-col min-w-0 flex-1">
        <!-- 编辑状态 -->
        <div v-if="isEditing" class="flex-1 flex gap-2">
          <input
            v-model="editingText"
            type="text"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="saveEdit"
            class="flex-1 px-3 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            v-focus
          />
        </div>

        <!-- 非编辑状态 -->
        <div v-else class="flex flex-col gap-1">
          <span
            :class="{
              'text-gray-800 font-medium break-all leading-normal': true,
              'line-through text-gray-400': todo.completed,
            }"
            @dblclick="startEditing"
          >
            {{ todo.text }}
          </span>

          <!-- 时间显示部分 -->
          <div class="flex items-center gap-3 text-xs text-gray-400">
            <span class="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(todo.createdAt) }}
            </span>
            <span
              v-if="todo.updatedAt !== todo.createdAt"
              class="flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {{ formatDate(todo.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-1 sm:gap-2">
      <!-- 编辑按钮 -->
      <button
        v-if="!todo.completed && !isEditing"
        @click="startEditing"
        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all duration-300 p-2 rounded-lg hover:bg-blue-50 flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      <!-- 删除按钮 -->
      <button
        @click="emit('remove', todo.id)"
        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all duration-300 p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </li>
</template>
