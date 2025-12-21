# types - TypeScript 类型定义

集中管理项目中所有 TypeScript 类型定义和接口。

## 文件列表

### [bar.ts](./bar.ts)

Bar 组件的类型定义。

#### barTitle 接口

```typescript
export interface barTitle {
  title?: string;                    // 标题文字
  icon?: ReactNode;                  // 图标元素(React 节点)
  leftContent?: ReactNode;           // 中间区域内容
  rightContent?: ReactNode;          // 右侧区域内容
  style?: React.CSSProperties;       // 自定义内联样式
  className?: string;                // 自定义 CSS 类名
}
```

使用场景:Bar 组件的 Props 接口,定义顶部标题栏的所有配置选项。

---

### [sidebar.ts](./sidebar.ts)

Sidebar 组件的类型定义。

#### SidebarProps 接口

```typescript
export interface SidebarProps {
  // 菜单配置
  menuItems?: MenuProps['items'];              // 菜单项数组(Ant Design Menu items)
  defaultSelectedKeys?: string[];              // 默认选中的菜单项 key
  defaultOpenKeys?: string[];                  // 默认展开的子菜单 key
  menuMode?: 'vertical' | 'inline';            // 菜单显示模式
  menuTheme?: 'light' | 'dark';                // 菜单主题

  // 尺寸配置
  defaultCollapsed?: boolean;                  // 是否默认折叠
  width?: number;                              // 展开时宽度(默认 250px)
  collapsedWidth?: number;                     // 折叠后宽度(默认 80px)
  minWidth?: number;                           // 最小可拖拽宽度(默认 200px)
  maxWidth?: number;                           // 最大可拖拽宽度(默认 600px)
  resizable?: boolean;                         // 是否允许拖拽调整宽度(默认 true)

  // 自定义内容
  header?: ReactNode | ((collapsed: boolean, toggle: () => void) => ReactNode);
                                               // 顶部内容区域(可以是静态节点或渲染函数)
  footer?: ReactNode;                          // 底部内容区域

  // 样式
  style?: React.CSSProperties;                 // 自定义内联样式
  className?: string;                          // 自定义 CSS 类名

  // 回调函数
  onCollapsedChange?: (collapsed: boolean) => void;  // 折叠状态变化回调
  onMenuClick?: MenuProps['onClick'];                // 菜单项点击回调
  onWidthChange?: (width: number) => void;           // 宽度变化回调
}
```

使用场景:

- Sidebar 组件的 Props 接口
- 支持完全自定义的侧边栏配置
- 集成 Ant Design Menu 类型系统

特殊功能:

- `header` 支持函数式渲染,可访问折叠状态和切换函数
- `menuItems` 复用 Ant Design 的 MenuProps 类型,保证类型兼容

---

### [user.ts](./user.ts)

用户相关的类型定义。

#### showUser 接口

```typescript
export interface showUser {
  name: string;           // 用户名称
  description: string;    // 用户描述/简介
}
```

使用场景:用户信息展示,可能用于用户菜单、个人资料等场景。

---

## 类型定义规范

### 1. 命名约定

- **接口名称**:使用 PascalCase,如 `SidebarProps`、`UserInfo`
- **Props 接口**:统一以 `Props` 结尾,如 `ComponentNameProps`
- **数据模型**:使用描述性名称,如 `User`、`MenuItem`

### 2. 文件组织

- 每个组件或功能模块对应一个类型文件
- 文件名使用 camelCase,如 `sidebar.ts`、`user.ts`
- 通用类型可创建 `common.ts` 或 `index.ts`

### 3. 导出方式

```typescript
// 推荐:命名导出
export interface ComponentProps { ... }
export type StatusType = 'success' | 'error' | 'warning';

// 可选:分组导出
export type { ComponentProps, StatusType };
```

### 4. 类型复用

```typescript
// 复用第三方库类型
import { MenuProps } from 'antd';
export interface SidebarProps {
  menuItems?: MenuProps['items'];  // 复用 Ant Design 类型
}

// 复用 React 类型
import { ReactNode, CSSProperties } from 'react';
export interface LayoutProps {
  children?: ReactNode;
  style?: CSSProperties;
}
```

### 5. 注释规范

```typescript
export interface ExampleProps {
  /** 主要描述,支持 Markdown */
  title: string;

  /**
   * 多行描述
   * @default false
   */
  enabled?: boolean;

  /** 回调函数:参数说明 */
  onChange?: (value: string) => void;
}
```

---

## 常用 React 类型

### 基础类型

```typescript
import {
  ReactNode,           // 任何可渲染的 React 内容
  ReactElement,        // React 元素
  CSSProperties,       // CSS 样式对象
  FC,                  // 函数组件类型
  PropsWithChildren,   // 带 children 的 Props
} from 'react';
```

### 事件类型

```typescript
import {
  MouseEvent,          // 鼠标事件
  ChangeEvent,         // 输入变化事件
  KeyboardEvent,       // 键盘事件
  FormEvent,           // 表单事件
} from 'react';

// 使用示例
onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
```

### Ant Design 类型

```typescript
import {
  MenuProps,           // Menu 组件 Props
  ButtonProps,         // Button 组件 Props
  ModalProps,          // Modal 组件 Props
} from 'antd';
```

---

## 类型导入示例

### 组件中使用

```typescript
// 在组件文件中导入类型
import type { SidebarProps } from '../../types/sidebar';
import type { barTitle } from '../../types/bar';

// 使用 type 关键字表明这是纯类型导入(推荐)
export const Sidebar: FC<SidebarProps> = (props) => {
  // 组件实现
};
```

### 类型扩展

```typescript
// 扩展现有类型
import type { SidebarProps } from './sidebar';

export interface ExtendedSidebarProps extends SidebarProps {
  extraFeature?: boolean;
}
```

---

## 最佳实践

1. **优先使用 interface 而非 type**
   - 接口可以被扩展和合并
   - 错误提示更友好

2. **标记可选属性**
   - 使用 `?` 标记可选属性
   - 提供 `@default` 注释说明默认值

3. **避免使用 any**
   - 使用 `unknown` 代替不确定的类型
   - 使用联合类型或泛型

4. **函数类型定义**

   ```typescript
   // 推荐
   onSubmit?: (data: FormData) => void;

   // 避免
   onSubmit?: Function;
   ```

5. **复用而非重复**
   - 从第三方库导入类型
   - 使用类型工具(Pick、Omit、Partial 等)

---

## 相关文档

- [组件开发规范](../components/README.md)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [React TypeScript 备忘录](https://react-typescript-cheatsheet.netlify.app/)
- [Ant Design TypeScript](https://ant.design/docs/react/use-with-typescript-cn)
