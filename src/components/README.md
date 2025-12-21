# components - 组件库

存放所有 React 组件的目录,按功能模块分类组织。

## 目录结构

```text
components/
├── layout/              # 布局组件
│   ├── Bar.tsx         # 顶部标题栏
│   └── Sidebar.tsx     # 侧边栏导航
└── common/              # 通用组件(待扩展)
```

## 组件分类

### layout - 布局组件

应用的主要布局结构组件,包括:

- **Bar** - 顶部标题栏,支持窗口拖拽
- **Sidebar** - 侧边栏导航,可折叠和拖拽调整宽度

详细说明见 [layout/README.md](./layout/README.md)

### common - 通用组件

存放可复用的通用 UI 组件,如:

- 按钮、输入框等基础组件的封装
- 对话框、提示框等交互组件
- 加载状态、错误边界等功能组件

## 组件开发规范

### 1. 文件命名

- 组件文件使用 PascalCase 命名:`ComponentName.tsx`
- 样式文件对应:`ComponentName.css`
- 类型定义:在 `src/types/` 目录创建对应的 `.ts` 文件

### 2. 组件结构

```tsx
import React from 'react';
import './ComponentName.css';
import type { ComponentNameProps } from '../../types/componentName';

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  // 组件逻辑
  return (
    <div className="component-name">
      {/* 组件内容 */}
    </div>
  );
};
```

### 3. 类型定义

- 所有组件的 Props 必须有明确的 TypeScript 接口定义
- 类型定义文件放在 `src/types/` 目录
- 使用 `export interface` 导出接口

### 4. 样式规范

- 每个组件有独立的 CSS 文件
- 样式文件放在 `src/styles/components/` 或 `src/styles/layout/` 对应目录
- 遵循菌丝灰白色调的设计系统
- 类名使用 kebab-case:`component-name`

### 5. 组件导出

推荐使用命名导出,便于 tree-shaking:

```tsx
export { ComponentName } from './ComponentName';
```

## 设计系统

所有组件遵循统一的**菌丝灰白**设计主题:

| 变量用途 | 颜色值 | 说明 |
|---------|--------|------|
| 主色 | `#5a4a3a` | 深灰色,用于文字和强调元素 |
| 背景色 | `#f5f5f0` | 浅灰白色,主要背景 |
| 次要色 | `#9a8a7a` | 中灰色,用于边框和次要元素 |
| 悬停色 | `#7a6a5a` | 交互状态 |
| 分割线 | `#e0e0d8` | 边框和分隔线 |

## 组件集成

### Ant Design

项目使用 Ant Design 6 作为基础 UI 库,推荐:

- 优先使用 Ant Design 组件
- 需要自定义时,可以基于 Ant Design 组件进行封装
- 统一主题配置保持一致性

### Tauri API

布局组件可能需要与 Tauri 后端交互:

```tsx
import { invoke } from '@tauri-apps/api/core';

// 调用 Rust 命令
const result = await invoke('command_name', { param: value });
```

## 相关文档

- [类型定义](../types/README.md)
- [样式系统](../styles/README.md)
- [布局组件详情](./layout/README.md)
