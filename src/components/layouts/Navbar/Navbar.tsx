import { Layout, Typography } from 'antd';

import { siteSettings } from '@/settings/siteSettings';

const { Header: AntHeader } = Layout;

function NavBar() {
  return (
    <AntHeader>
      <Typography.Title level={3}>{siteSettings.name}</Typography.Title>
      {/* <Menu
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
      /> */}
    </AntHeader>
  );
}

export default NavBar;
