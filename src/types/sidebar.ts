import { ReactNode } from "react";
import { MenuProps } from "antd";

export interface SidebarProps {
    /** 菜单项配置 */
    menuItems?: MenuProps['items'];
    /** 默认选中的菜单项 */
    defaultSelectedKeys?: string[];
    /** 默认展开的子菜单 */
    defaultOpenKeys?: string[];
    /** 菜单模式 */
    menuMode?: 'vertical' | 'inline';
    /** 菜单主题 */
    menuTheme?: 'light' | 'dark';
    /** 是否默认折叠 */
    defaultCollapsed?: boolean;
    /** 侧边栏宽度（展开时），单位px，默认250 */
    width?: number;
    /** 折叠后的宽度，单位px，默认80 */
    collapsedWidth?: number;
    /** 最小宽度，单位px，默认200 */
    minWidth?: number;
    /** 最大宽度，单位px，默认600 */
    maxWidth?: number;
    /** 是否可拖拽调整宽度，默认true */
    resizable?: boolean;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 自定义类名 */
    className?: string;
    /** 自定义顶部内容（在菜单上方），可以是 ReactNode 或接收 collapsed 和 toggle 函数的渲染函数 */
    header?: ReactNode | ((collapsed: boolean, toggle: () => void) => ReactNode);
    /** 自定义底部内容（在菜单下方） */
    footer?: ReactNode;
    /** 折叠状态改变回调 */
    onCollapsedChange?: (collapsed: boolean) => void;
    /** 菜单项点击回调 */
    onMenuClick?: MenuProps['onClick'];
    /** 宽度改变回调 */
    onWidthChange?: (width: number) => void;
}
