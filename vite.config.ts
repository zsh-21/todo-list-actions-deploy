import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 使用 defineConfig 的类型定义
// eslint-disable-next-line no-undef
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/todo-list-actions-deploy/" : "/";

  return {
    plugins: [vue()],
    base,
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  };
});
