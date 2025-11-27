import { barTitle } from '../../types/bar';
import { Col, Row } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';
import '../../styles/layout/Bar.css';

function Bar({ title, icon, leftContent, rightContent, style, className }: barTitle) {
  const handleMouseDown = (e: React.MouseEvent) => {
    // 只在左键点击时触发拖拽
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    // 检查是否点击了交互元素
    const isInteractive = target.closest('button, input, a, [role="button"]');

    if (!isInteractive) {
      e.preventDefault();
      getCurrentWindow().startDragging().catch((err) => {
        // 静默处理错误，某些情况下这是正常的
        console.debug('Drag error:', err);
      });
    }
  };

  const handleDoubleClick = async (e: React.MouseEvent) => {
    return
    const target = e.target as HTMLElement;
    // 检查是否点击了交互元素
    const isInteractive = target.closest('button, input, a, [role="button"]');

    if (!isInteractive) {
      e.preventDefault();
      const appWindow = getCurrentWindow();
      await appWindow.toggleMaximize();
    }
  };

  return (
    <div
      className={`customBar ${className || ''}`}
      style={style}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <Row
        align="middle"
        className="barRow"
        gutter={16}
      >
        {/* 左侧区域 - 图标和标题 */}
        <Col
          flex="none"
          className="barLeftCol"
          span={2}
        >
          {icon && <span className="barIcon">{icon}</span>}
          {title && <span className="barTitle">{title}</span>}
        </Col>

        {/* 中间区域 */}
        <Col
          flex="auto"
          className="barCenterCol"
          span={14}
        >
          {leftContent}
        </Col>

        {/* 右侧区域   */}
        <Col
          flex="none"
          className="barRightCol"
          span={8}
        >
          {rightContent}
        </Col>
      </Row>
    </div>
  );
}

export default Bar;