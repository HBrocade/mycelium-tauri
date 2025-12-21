# src - 前端源代码目录

这是 Mycelium Tauri 应用的前端源代码目录,包含所有 React/TypeScript 代码。

## 目录结构

```text
src/
├── main.tsx                 # React 应用入口文件
├── App.tsx                  # 主应用组件
├── components/              # React 组件库
├── types/                   # TypeScript 类型定义
├── styles/                  # CSS 样式文件
├── hooks/                   # 自定义 React Hooks
├── utils/                   # 工具函数
└── constants/               # 常量定义
```

## 核心文件说明

### main.tsx

- React 应用的入口点
- 负责将 App 组件挂载到 DOM 的 `#root` 元素
- 配置 React 的严格模式

### App.tsx

- 主应用组件
- 组织整体布局结构(Bar + Sidebar + 主内容区)
- 管理全局状态和路由

## 技术栈

- **React 18.2** - UI 框架
- **TypeScript** - 类型安全
- **Ant Design 6** - UI 组件库
- **Vite** - 构建工具

## 设计理念

项目采用**菌丝灰白色调**作为主题配色:

- 主色:`#5a4a3a` (深灰)
- 背景:`#f5f5f0` (浅灰)
- 强调色:`#9a8a7a` (中灰)

## 开发规范

1. 所有组件使用 TypeScript,确保类型安全
2. 组件按功能分类到 components 目录的子目录中
3. 样式文件与组件目录结构保持一致
4. 类型定义统一在 types 目录管理
5. 复用的工具函数放在 utils 目录
6. 全局常量定义在 constants 目录

## 相关文档

- [组件库说明](./components/README.md)
- [类型定义说明](./types/README.md)
- [样式系统说明](./styles/README.md)
