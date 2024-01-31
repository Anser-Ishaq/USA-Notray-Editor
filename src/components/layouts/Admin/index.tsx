import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Row, theme, Typography } from 'antd';
import { createElement, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useNavigate } from 'react-router-dom';

import { siteSettings } from '@/settings/siteSettings';

import reactLogo from '/react.svg';

const { Sider, Content, Header, Footer } = Layout;

const AdminLayout: React.FC<{ children?: React.ReactNode }> = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(isMobile);
  const {
    token: { colorBgContainer, colorTextLightSolid },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={240}
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Row className="pt-6 px-6 mb-5" justify="space-between" align="middle">
          <div className="flex items-center">
            <img src={reactLogo} className="m-0 p-0 w-8" alt="React logo" />
            {!collapsed ? (
              <Typography.Title
                level={3}
                className="m-0 ml-4"
                style={{ color: colorTextLightSolid }}
              >
                {siteSettings.name}
              </Typography.Title>
            ) : null}
          </div>
          {isMobile ? (
            <CloseOutlined
              onClick={() => setCollapsed((prev) => !prev)}
              style={{ color: colorTextLightSolid }}
            />
          ) : null}
        </Row>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={siteSettings.sidebarLinks.admin.map((route) => ({
            label: route.label,
            key: route.key,
            ...(route.icon ? { icon: createElement(route.icon) } : {}),
            onClick: () => navigate(route.key),
          }))}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed && !isMobile ? 80 : !isMobile ? 240 : 0,
        }}
      >
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="link"
            icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content className="mx-5 mt-5">
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
