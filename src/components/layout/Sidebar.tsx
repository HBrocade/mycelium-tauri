import { useState, useRef, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { SidebarProps } from '../../types/sidebar';
import '../../styles/layout/Sidebar.css';

const { Sider } = Layout;

function Sidebar({
  menuItems = [],
  defaultSelectedKeys = [],
  defaultOpenKeys = [],
  menuMode = 'inline',
  menuTheme = 'light',
  defaultCollapsed = false,
  width = 250,
  collapsedWidth = 80,
  minWidth = 150,
  maxWidth = 600,
  resizable = true,
  style,
  className,
  header,
  footer,
  onCollapsedChange,
  onMenuClick,
  onWidthChange
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentWidth, setCurrentWidth] = useState(width);
  const [isResizing, setIsResizing] = useState(false);
  const siderRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  // 处理拖拽调整宽度
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !siderRef.current) return;

      const newWidth = e.clientX;
      const collapseThreshold = minWidth - 50; // 设置收纳阈值，比最小宽度小50px

      // 如果拖动宽度小于阈值，切换到收纳状态
      if (newWidth < collapseThreshold) {
        if (!collapsed) {
          setCollapsed(true);
          onCollapsedChange?.(true);
        }
      } else if (newWidth >= minWidth && newWidth <= maxWidth) {
        // 在正常范围内，如果是收纳状态则展开
        if (collapsed) {
          setCollapsed(false);
          onCollapsedChange?.(false);
        }
        setCurrentWidth(newWidth);
        onWidthChange?.(newWidth);
      } else if (newWidth >= collapseThreshold && newWidth < minWidth) {
        // 在阈值和最小宽度之间，展开并设置为最小宽度
        if (collapsed) {
          setCollapsed(false);
          onCollapsedChange?.(false);
        }
        setCurrentWidth(minWidth);
        onWidthChange?.(minWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, minWidth, maxWidth, collapsed, onWidthChange, onCollapsedChange]);

  // 判断 header 是函数还是 ReactNode
  const headerContent = typeof header === 'function'
    ? header(collapsed, handleToggle)
    : header;

  return (
    <div
      ref={siderRef}
      style={{ position: 'relative', display: 'flex' }}
      className={`sidebar-wrapper ${isResizing ? 'resizing' : ''}`}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null} // 禁用默认的 trigger
        width={collapsed ? collapsedWidth : currentWidth}
        collapsedWidth={collapsedWidth}
        theme={menuTheme}
        className={className}
        style={style}
      >
        <div className="sidebar-content">
          {/* 顶部内容区域 */}
          {headerContent && (
            <div className="sidebar-header">
              {headerContent}
            </div>
          )}

          {/* 菜单区域 */}
          <div className="sidebar-menu-wrapper">
            <Menu
              mode={menuMode}
              theme={menuTheme}
              defaultSelectedKeys={defaultSelectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              items={menuItems}
              onClick={onMenuClick}
            />
          </div>

          {/* 底部内容区域 */}
          {footer && (
            <div className="sidebar-footer">
              {footer}
            </div>
          )}
        </div>
      </Sider>

      {/* 拖拽调整宽度的把手 */}
      {resizable && (
        <div
          className={`sidebar-resize-handle ${isResizing ? 'resizing' : ''}`}
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
}

export default Sidebar;
