# Vue3 + TypeScript Todo 应用

这是一个使用 Vue3、TypeScript 和 Vite 构建的简单待办事项应用。

## 项目创建步骤

1. 使用 Vite 创建项目

npm create vite@latest my-todo-app -- --template vue-ts

2. 进入项目目录并安装依赖

   npm create vite@latest my-todo-app -- --template vue-ts

3. 启动开发服务器

npm run dev

## 项目结构

my-todo-app/
├── src/
│ ├── App.vue # 主应用组件
│ ├── style.css # 全局样式
│ └── main.ts # 应用入口文件
├── public/ # 静态资源
├── package.json # 项目配置文件
├── tsconfig.json # TypeScript 配置
├── vite.config.ts # Vite 配置
└── README.md # 项目说明文档

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Composition API

## 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 功能特性

- 添加待办事项
- 标记完成/未完成
- 删除待办事项
- 数据本地存储

## 许可证

MIT
