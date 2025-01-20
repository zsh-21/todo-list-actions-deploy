<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Todo } from "./types/todo";
import { vFocus } from "./directives/focus";

const newTodo = ref("");
const searchQuery = ref("");
const filter = ref<"all" | "active" | "completed">("all");
const todos = ref<Todo[]>(JSON.parse(localStorage.getItem("todos") || "[]"));

const editingId = ref<number | null>(null);
const editingText = ref("");

// 主题模式类型
type ThemeMode = "light" | "dark" | "system";

// 主题设置
const themeMode = ref<ThemeMode>(
  (localStorage.getItem("theme-mode") as ThemeMode) || "system"
);
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
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (themeMode.value === "system") {
      isDark.value = e.matches;
      document.documentElement.classList.toggle("dark", e.matches);
    }
  });

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
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const addTodo = () => {
  if (newTodo.value.trim()) {
    const now = new Date().toISOString();
    todos.value.unshift({
      id: Date.now(),
      text: newTodo.value,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    newTodo.value = "";
    alert("待办事项添加成功！");
  }
};

const toggleTodo = (todo: Todo) => {
  todo.completed = !todo.completed;
};

const removeTodo = (id: number) => {
  if (confirm("确定要删除这个待办事项吗？")) {
    todos.value = todos.value.filter((todo) => todo.id !== id);
    alert("待办事项已删除！");
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const startEditing = (todo: Todo) => {
  if (!todo.completed) {
    // 只允许编辑未完成的待办
    editingId.value = todo.id;
    editingText.value = todo.text;
  }
};

const saveEdit = (todo: Todo) => {
  const text = editingText.value.trim();
  if (text && text !== todo.text) {
    todo.text = text;
    todo.updatedAt = new Date().toISOString();
    alert("修改已保存！");
  }
  editingId.value = null;
};

const cancelEdit = () => {
  editingId.value = null;
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
    <!-- 主题切换按钮组 -->
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
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索待办事项..."
            class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <button
              v-for="option in ['all', 'active', 'completed']"
              :key="option"
              @click="filter = option as 'all' | 'active' | 'completed'"
              :class="{
                'px-4 py-2.5 rounded-xl transition-all duration-300 font-medium shadow-sm whitespace-nowrap': true,
                'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200/50 hover:shadow-lg hover:translate-y-[-1px]':
                  filter === option,
                'bg-white/70 backdrop-blur text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:text-blue-600':
                  filter !== option,
              }"
            >
              {{
                option === "all"
                  ? "全部"
                  : option === "active"
                  ? "进行中"
                  : "已完成"
              }}
            </button>
          </div>
        </div>

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

        <!-- 待办列表 -->
        <ul class="space-y-2.5">
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="group flex items-center justify-between p-3 sm:p-4 bg-white/70 backdrop-blur rounded-xl hover:bg-blue-50/80 transition-all duration-200 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow"
          >
            <div class="flex items-center space-x-3 min-w-0 flex-1">
              <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo)"
                class="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              />
              <div class="flex flex-col min-w-0 flex-1">
                <!-- 编辑状态 -->
                <div v-if="editingId === todo.id" class="flex-1 flex gap-2">
                  <input
                    v-model="editingText"
                    type="text"
                    @keyup.enter="saveEdit(todo)"
                    @keyup.esc="cancelEdit"
                    @blur="saveEdit(todo)"
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
                    @dblclick="startEditing(todo)"
                  >
                    {{ todo.text }}
                  </span>

                  <!-- 优化时间显示部分 -->
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
                v-if="!todo.completed && editingId !== todo.id"
                @click="startEditing(todo)"
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
                @click="removeTodo(todo.id)"
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
        </ul>

        <!-- 统计信息 -->
        <div class="text-sm text-gray-500 text-center pt-2">
          总计 {{ todos.length }} 项 / 已完成
          {{ todos.filter((t) => t.completed).length }} 项 / 未完成
          {{ todos.filter((t) => !t.completed).length }} 项
        </div>
      </div>
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
