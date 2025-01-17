import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 获取仓库名称作为 base URL
const base =
  process.env.NODE_ENV === "production" ? "/todo-list-actions-deploy/" : "/";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: base, // 添加这行配置
  build: {
    outDir: "dist", // 输出目录
    assetsDir: "assets", // 静态资源目录
    sourcemap: false, // 不生成 sourcemap
    minify: "terser", // 使用 terser 进行压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true, // 移除 debugger
      },
    },
  },
});
