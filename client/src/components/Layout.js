import React from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, DashboardOutlined, TeamOutlined, DollarOutlined, ShoppingOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';
import './Layout.css';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'ড্যাশবোর্ড',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'ছাত্র ব্যবস্থাপনা',
      onClick: () => navigate('/students'),
    },
    {
      key: '/income',
      icon: <DollarOutlined />,
      label: 'আয়',
      onClick: () => navigate('/income'),
    },
    {
      key: '/expense',
      icon: <ShoppingOutlined />,
      label: 'ব্যয়',
      onClick: () => navigate('/expense'),
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'রিপোর্ট',
      onClick: () => navigate('/reports'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'সেটিংস',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={200}
      >
        <div className="app-logo">
          <h2>মাদ্রাসা</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          style={{ marginTop: '24px' }}
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', color: '#fff' }}
          />
          <div style={{ marginLeft: 'auto' }}>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: '#fff' }}
            >
              লগআউট
            </Button>
          </div>
        </Header>
        <Content className="app-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
