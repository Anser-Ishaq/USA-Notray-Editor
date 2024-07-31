import { HomeFilled } from '@ant-design/icons';

import APP_ROUTES from '@/utils/routes';

export const siteSettings = {
  name: 'Patient',
  description: '',
  logo: {},
  collapseLogo: {},
  defaultLanguage: 'en',
  sidebarLinks: {
    admin: [
      {
        key: APP_ROUTES.DASHBOARD,
        label: 'Home',
        icon: HomeFilled,
      },
    ],
  },
};
