import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

const ThemeProvider: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ConfigProvider
      getPopupContainer={(trigger: any) => trigger?.parentNode}
      theme={{
        token: { colorPrimary: '#0d9965' },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
