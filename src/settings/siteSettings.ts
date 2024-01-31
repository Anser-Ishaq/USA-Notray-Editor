import {
  ContainerFilled,
  DollarCircleFilled,
  HomeFilled,
} from '@ant-design/icons';

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
        key: APP_ROUTES.HOME,
        label: 'Home',
        icon: HomeFilled,
      },
      {
        key: APP_ROUTES.PRODUCTS,
        label: 'Products',
        icon: ContainerFilled,
      },
      {
        key: APP_ROUTES.ORDERS,
        label: 'Orders',
        icon: DollarCircleFilled,
      },
    ],
  },
};
