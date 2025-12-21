# layout - 布局组件

应用的主要布局组件,负责构建整体界面结构。

## 组件列表

### Bar - 顶部标题栏

**文件**: [Bar.tsx](./Bar.tsx)
**样式**: [Bar.css](../../styles/layout/Bar.css)
**类型**: [bar.ts](../../types/bar.ts)

#### Bar 功能特性

- 自定义顶部标题栏,替代系统原生标题栏
- 支持窗口拖拽移动(集成 Tauri API)
- 双击最大化/还原窗口(当前已禁用)
- 响应式三栏布局:左中右
- 防止交互元素触发拖拽(按钮、输入框等)

#### Bar Props 接口

```typescript
interface barTitle {
  title?: string;              // 标题文字
  icon?: React.ReactNode;      // 图标元素
  leftContent?: React.ReactNode;   // 中间区域内容
  rightContent?: React.ReactNode;  // 右侧区域内容
  style?: React.CSSProperties;     // 自定义样式
  className?: string;              // 自定义类名
}
```

#### Bar 布局结构

```text
┌─────────────────────────────────────────┐
│ [图标+标题]   [中间内容]      [右侧内容] │ (2:14:8 栅格比例)
└─────────────────────────────────────────┘
```

#### Bar 使用示例

```tsx
import Bar from './components/layout/Bar';

<Bar
  title="Mycelium"
  icon={<Icon />}
  leftContent={<SearchBar />}
  rightContent={<UserMenu />}
/>
```

#### Bar 技术实现

- 使用 Ant Design 的 Row/Col 栅格系统
- 调用 `@tauri-apps/api/window` 的 `startDragging()` 实现窗口拖拽
- 鼠标事件检测确保只有左键点击非交互元素时触发拖拽
- 菌丝灰白渐变背景(`#e8e8e0` → `#d8d8d0`)

---

### Sidebar - 侧边栏导航

**文件**: [Sidebar.tsx](./Sidebar.tsx)
**样式**: [Sidebar.css](../../styles/layout/Sidebar.css)
**类型**: [sidebar.ts](../../types/sidebar.ts)

#### Sidebar 功能特性

- 可折叠的侧边栏导航
- 动态拖拽调整宽度
- 智能收纳阈值(拖到最小宽度以下自动折叠)
- 自定义头部和底部区域
- 集成 Ant Design Menu 组件
- 支持亮色/暗色主题

#### Sidebar Props 接口

```typescript
interface SidebarProps {
  // 菜单配置
  menuItems?: MenuItem[];               // 菜单项数组
  defaultSelectedKeys?: string[];       // 默认选中菜单
  defaultOpenKeys?: string[];          // 默认展开菜单
  menuMode?: 'inline' | 'vertical';    // 菜单模式
  menuTheme?: 'light' | 'dark';        // 菜单主题

  // 尺寸配置
  defaultCollapsed?: boolean;          // 默认是否折叠
  width?: number;                      // 默认宽度 (250px)
  collapsedWidth?: number;             // 折叠宽度 (80px)
  minWidth?: number;                   // 最小宽度 (150px)
  maxWidth?: number;                   // 最大宽度 (600px)
  resizable?: boolean;                 // 是否可拖拽调整宽度

  // 自定义区域
  header?: React.ReactNode | ((collapsed: boolean, toggle: () => void) => React.ReactNode);
  footer?: React.ReactNode;

  // 样式
  style?: React.CSSProperties;
  className?: string;

  // 回调函数
  onCollapsedChange?: (collapsed: boolean) => void;
  onMenuClick?: (info: any) => void;
  onWidthChange?: (width: number) => void;
}
```

#### Sidebar 使用示例

```tsx
import Sidebar from './components/layout/Sidebar';
import { MenuProps } from 'antd';

const menuItems: MenuProps['items'] = [
  {
    key: '1',
    icon: <HomeIcon />,
    label: '首页',
  },
  {
    key: '2',
    icon: <SettingIcon />,
    label: '设置',
  },
];

<Sidebar
  menuItems={menuItems}
  defaultSelectedKeys={['1']}
  width={250}
  resizable={true}
  header={(collapsed, toggle) => (
    <div onClick={toggle}>
      {collapsed ? <MenuUnfoldIcon /> : <MenuFoldIcon />}
    </div>
  )}
  onMenuClick={(info) => console.log('Menu clicked:', info.key)}
/>
```

#### Sidebar 技术实现

- 使用 Ant Design 的 Layout.Sider 和 Menu 组件
- React Hooks 管理状态:
  - `useState` - 折叠状态、当前宽度、拖拽状态
  - `useRef` - 侧边栏 DOM 引用
  - `useEffect` - 监听鼠标移动和释放事件
- 拖拽调整宽度逻辑:
  - 小于收纳阈值(minWidth - 50px) → 自动折叠
  - 在阈值和最小宽度之间 → 展开并设置为最小宽度
  - 在最小和最大宽度之间 → 自由调整
- 拖拽把手 `.sidebar-resize-handle` 提供视觉反馈

#### Sidebar 交互行为

1. **点击折叠按钮** - 在 collapsed 和 expanded 状态之间切换
2. **拖拽右侧把手** - 实时调整宽度
3. **拖到极左** - 宽度小于阈值时自动折叠
4. **拖回** - 宽度超过阈值时自动展开

---

## 设计规范

### 颜色系统

- **主色**: `#5a4a3a` (深灰)
- **背景色**: `#f5f5f0` (浅灰白)
- **边框色**: `#e0e0d8` (浅灰)
- **悬停色**: `#7a6a5a` (中深灰)
- **选中色**: `#9a8a7a` (中灰)

### 尺寸规范

- **Bar 高度**: 48px
- **Sidebar 默认宽度**: 250px
- **Sidebar 折叠宽度**: 80px
- **Sidebar 最小宽度**: 150px
- **Sidebar 最大宽度**: 600px
- **拖拽把手宽度**: 4px

### 动画效果

- **宽度过渡**: `width 0.3s ease`
- **背景过渡**: `background-color 0.2s ease`
- **拖拽把手悬停**: 宽度从 4px 变为 8px

---

## 集成 Tauri API

### Bar 组件 - 窗口操作

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

// 窗口拖拽
await getCurrentWindow().startDragging();

// 最大化切换(当前禁用)
await getCurrentWindow().toggleMaximize();
```

### 注意事项

1. 确保在 `tauri.conf.json` 中配置了 `titleBarStyle: "Overlay"`
2. 窗口拖拽仅在非交互元素上触发
3. 双击最大化功能已通过 `return` 禁用

---

## 相关文档

- [类型定义](../../types/README.md)
- [样式系统](../../styles/README.md)
- [Ant Design Layout](https://ant.design/components/layout-cn/)
- [Tauri Window API](https://tauri.app/v1/api/js/window)
