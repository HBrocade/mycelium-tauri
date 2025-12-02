import "./styles/App.css";
import Bar from "./components/layout/Bar";
import Sidebar from "./components/layout/Sidebar";
import {
  CompassOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { showUser } from "./types/user";

const { Text } = Typography;

function App() {
  // 定义菜单项
  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    }
  ];
  useEffect(() => {
    const showUser: showUser = {
      name: '123',
      description: 'qwe'
    }
    setShowUser(showUser)
  })
  const [showUserInfo, setShowUserInfo] = useState<showUser>()

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('点击了菜单项:', e.key);
  };

  const setShowUser = (showUser: showUser) => {
    setShowUserInfo(showUser)
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Bar
        style={{
          position: 'sticky',
          top: 0
        }}
        title="Mycelium"
        icon={<CompassOutlined />}
      />

      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Sidebar
          menuItems={menuItems}
          defaultSelectedKeys={['home']}
          defaultOpenKeys={['user']}
          onMenuClick={handleMenuClick}
          header={(_collapsed, toggle) => (
            <Space size={12} style={{ width: '100%' }}>
              <Avatar
                size={48}
                icon={<UserOutlined />}
                onClick={toggle}
                style={{
                  backgroundColor: '#1890ff',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text strong style={{ display: 'block', fontSize: '16px' }}>
                  {/* 用户名称 */}
                  {showUserInfo?.name}
                </Text>
                <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                  {/* user@example.com */}
                  {showUserInfo?.description}
                </Text>
              </div>
            </Space>
          )}
        />

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
          }}
        >
          {/* 主内容区域 */}
          123
        </div>
      </div>
    </div>
  );
}

export default App;