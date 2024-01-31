import { UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { siteSettings } from '@/settings/siteSettings';
import APP_ROUTES from '@/utils/routes';

const { Header: AntHeader } = Layout;

function NavBar() {
  const navigate = useNavigate();

  return (
    <AntHeader>
      <Typography.Title level={3}>{siteSettings.name}</Typography.Title>
      <Menu
        theme="dark"
        selectable={false}
        mode="horizontal"
        overflowedIndicator={
          <Button
            icon={<UserOutlined />}
            type="primary"
            shape="circle"
            size="large"
          ></Button>
        }
        getPopupContainer={undefined}
        style={{
          position: 'absolute',
          right: 8,
          top: 0,
          maxWidth: '150px',
        }}
        items={dropDownRoutes.map((route) => ({
          ...route,
          onClick: () => navigate(route.key),
        }))}
      />
    </AntHeader>
  );
}

export default NavBar;

const dropDownRoutes = [
  {
    label: 'Logout',
    key: APP_ROUTES.LOGOUT,
  },
];
