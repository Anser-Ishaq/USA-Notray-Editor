import { Provider, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import PageLoader from '@/components/ui/PageLoader';
import { globalStore, RootState } from '@/store';
import APP_ROUTES from '@/utils/routes';

import { Dashboard } from './pages';

function AppRoutes() {
  const { loader } = useSelector((state: RootState) => state.app);
  return (
    <>
      <PageLoader loading={loader?.isLoading} message={loader?.message} />
      <Routes>
        <Route path={APP_ROUTES.EDITOR} element={<Dashboard />} />
        <Route path={APP_ROUTES.TEMPLATE_CREATION} element={<Dashboard />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={globalStore}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
