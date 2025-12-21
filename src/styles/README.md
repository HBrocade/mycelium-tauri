# styles - 样式系统

项目的所有 CSS 样式文件,遵循菌丝灰白色调设计系统。

## 目录结构

```text
styles/
├── global.css           # 全局样式和 CSS 变量
├── App.css              # 主应用容器样式
├── layout/              # 布局组件样式
│   ├── Bar.css         # 顶部标题栏样式
│   └── Sidebar.css     # 侧边栏样式
└── components/          # 通用组件样式(待扩展)
```

---

## 设计系统

### 菌丝灰白色调

项目采用统一的菌丝灰白配色方案,营造自然、温和的视觉体验。

#### 主色板

| 颜色名称 | 色值 | 用途 | 预览 |
| -------- | ---- | ---- | ---- |
| 深灰 (Deep) | `#5a4a3a` | 主要文字、强调元素 | ![#5a4a3a](https://via.placeholder.com/50x20/5a4a3a/5a4a3a) |
| 中深灰 | `#7a6a5a` | 悬停状态、次要强调 | ![#7a6a5a](https://via.placeholder.com/50x20/7a6a5a/7a6a5a) |
| 中灰 | `#9a8a7a` | 选中状态、活跃元素 | ![#9a8a7a](https://via.placeholder.com/50x20/9a8a7a/9a8a7a) |
| 浅灰 | `#e0e0d8` | 边框、分隔线 | ![#e0e0d8](https://via.placeholder.com/50x20/e0e0d8/e0e0d8) |
| 浅灰白 | `#f5f5f0` | 主背景色 | ![#f5f5f0](https://via.placeholder.com/50x20/f5f5f0/f5f5f0) |

#### 渐变色

| 名称 | 渐变定义 | 用途 |
| ---- | ------- | ---- |
| Bar 背景渐变 | `linear-gradient(to bottom, #e8e8e0, #d8d8d0)` | 顶部标题栏背景 |
| Sidebar 背景 | `#fafaf8` | 侧边栏背景色 |

---

## 文件说明

### [global.css](./global.css)

全局样式和重置样式。

主要内容:

- CSS Reset(基础样式重置)
- 全局字体设置
- 通用 CSS 变量定义
- 滚动条样式
- 默认文字颜色和背景色

CSS 变量:

```css
:root {
  --color-primary: #5a4a3a;      /* 主色 */
  --color-background: #f5f5f0;   /* 背景色 */
  --color-border: #e0e0d8;       /* 边框色 */
  /* 更多变量... */
}
```

---

### [App.css](./App.css)

主应用容器样式。

主要样式:

- `.App` - 主容器(全屏布局)
- 应用级别的 Flexbox 或 Grid 布局
- 全局容器尺寸和定位

---

### layout/[Bar.css](./layout/Bar.css)

顶部标题栏组件样式。

类名列表:

- `.customBar` - 主容器(高度 48px,渐变背景)
- `.barRow` - Ant Design Row 容器
- `.barLeftCol` - 左侧栏(图标+标题)
- `.barCenterCol` - 中间内容区
- `.barRightCol` - 右侧内容区
- `.barIcon` - 图标样式
- `.barTitle` - 标题文字样式

特性:

- 使用 `linear-gradient` 实现渐变背景
- 支持 `-webkit-app-region: drag` 实现窗口拖拽(Tauri)
- 响应式布局(栅格系统)

---

### layout/[Sidebar.css](./layout/Sidebar.css)

侧边栏组件样式。

类名列表:

- `.sidebar-wrapper` - 侧边栏外层容器
- `.sidebar-wrapper.resizing` - 拖拽调整宽度时的状态
- `.sidebar-content` - 侧边栏内容容器
- `.sidebar-header` - 顶部区域
- `.sidebar-menu-wrapper` - 菜单容器
- `.sidebar-footer` - 底部区域
- `.sidebar-resize-handle` - 拖拽把手(4px 宽,悬停时 8px)
- `.sidebar-resize-handle.resizing` - 拖拽中状态

交互效果:

- 拖拽把手悬停放大效果
- 菜单项悬停/选中颜色变化
- 宽度调整平滑过渡动画

自定义 Ant Design Menu:

```css
.sidebar-menu-wrapper .ant-menu-item:hover {
  background-color: #e8e8e0 !important;
}

.sidebar-menu-wrapper .ant-menu-item-selected {
  background-color: #9a8a7a !important;
  color: #fff !important;
}
```

---

## 样式编写规范

### 1. 类名命名

- 使用 **kebab-case**:`.component-name`
- BEM 方法论(可选):`.block__element--modifier`
- 语义化命名:`.sidebar-header`、`.menu-item-active`

### 2. 文件组织

```text
styles/
├── global.css           # 全局变量和重置
├── App.css              # 应用容器
├── layout/              # 布局组件样式
│   ├── ComponentName.css
│   └── AnotherComponent.css
└── components/          # 通用组件样式
    └── Button.css
```

### 3. CSS 变量使用

```css
/* 定义变量 */
:root {
  --primary-color: #5a4a3a;
  --spacing-sm: 8px;
}

/* 使用变量 */
.component {
  color: var(--primary-color);
  padding: var(--spacing-sm);
}
```

### 4. 响应式设计

```css
/* 移动端优先 */
.component {
  width: 100%;
}

/* 平板 */
@media (min-width: 768px) {
  .component {
    width: 50%;
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .component {
    width: 33.33%;
  }
}
```

### 5. 覆盖 Ant Design 样式

```css
/* 使用类名前缀提高优先级 */
.custom-wrapper .ant-menu-item {
  color: #5a4a3a;
}

/* 使用 !important(谨慎使用) */
.ant-btn-primary {
  background-color: #5a4a3a !important;
}
```

---

## 动画和过渡

### 常用过渡

```css
/* 宽度过渡 */
.sidebar {
  transition: width 0.3s ease;
}

/* 背景色过渡 */
.menu-item {
  transition: background-color 0.2s ease;
}

/* 多属性过渡 */
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 常用动画

```css
/* 淡入淡出 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.component {
  animation: fadeIn 0.3s ease-in-out;
}
```

---

## 主题定制

### Ant Design 主题配置

在项目中可以通过 ConfigProvider 定制 Ant Design 主题:

```tsx
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#5a4a3a',        // 主色
      colorBgContainer: '#fafaf8',    // 容器背景
      borderRadius: 4,                // 圆角
      colorBorder: '#e0e0d8',         // 边框色
    },
  }}
>
  <App />
</ConfigProvider>
```

### CSS 变量主题切换

```css
/* 亮色主题(默认) */
:root {
  --bg-color: #f5f5f0;
  --text-color: #5a4a3a;
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-color: #2a2a2a;
  --text-color: #e0e0e0;
}
```

```tsx
// 主题切换
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 性能优化

### 1. 避免过度重绘

```css
/* 推荐:使用 transform 而非 left/top */
.element {
  transform: translateX(100px);
  /* 避免:left: 100px; */
}
```

### 2. 使用 GPU 加速

```css
.animated {
  will-change: transform;
  transform: translateZ(0);
}
```

### 3. 减少选择器复杂度

```css
/* 推荐 */
.menu-item { }

/* 避免 */
.container > .wrapper > .menu > .item { }
```

---

## 相关文档

- [组件库](../components/README.md)
- [Ant Design 样式定制](https://ant.design/docs/react/customize-theme-cn)
- [CSS 模块化](https://github.com/css-modules/css-modules)
- [菌丝灰白设计规范](./DESIGN_GUIDE.md) (待创建)
