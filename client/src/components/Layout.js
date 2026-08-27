import React from 'react';
import { useDispatch } from 'react-redux';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, DashboardOutlined, TeamOutlined, DollarOutlined, ShoppingOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';
import './Layout.css';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'ড্যাশবোর্ড',
      onClick: () => {
        navigate('/dashboard');
        setDrawerVisible(false);
      },
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'ছাত্র ব্যবস্থাপনা',
      onClick: () => {
        navigate('/students');
        setDrawerVisible(false);
      },
    },
    {
      key: '/income',
      icon: <DollarOutlined />,
      label: 'আয়',
      onClick: () => {
        navigate('/income');
        setDrawerVisible(false);
      },
    },
    {
      key: '/expense',
      icon: <ShoppingOutlined />,
      label: 'ব্যয়',
      onClick: () => {
        navigate('/expense');
        setDrawerVisible(false);
      },
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'রিপোর্ট',
      onClick: () => {
        navigate('/reports');
        setDrawerVisible(false);
      },
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'সেটিংস',
      onClick: () => {
        navigate('/settings');
        setDrawerVisible(false);
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for desktop */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={200}
        breakpoint="md"
        collapsedWidth={0}
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
        style={{ display: 'none' }}
        className="desktop-sidebar"
      >
        <div className="app-logo">
          <h2>মাদ্রাসা</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[location.pathname]}
          style={{ marginTop: '24px' }}
        />
      </Sider>

      {/* Mobile drawer */}
      <Drawer
        title="মেনু"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Menu
          theme="light"
          mode="inline"
          items={menuItems}
          onClick={() => setDrawerVisible(false)}
        />
      </Drawer>

      <Layout>
        <Header className="app-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', color: '#fff', display: 'none' }}
            className="desktop-menu-btn"
          />
          <Button
            type="text"
            icon={<MenuFoldOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ fontSize: '16px', color: '#fff' }}
            className="mobile-menu-btn"
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
