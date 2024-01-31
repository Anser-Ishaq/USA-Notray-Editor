import { Route, Routes } from 'react-router';

import AdminLayout from './components/layouts/Admin';
import { Home, Products } from './pages';
import APP_ROUTES from './utils/routes';

function App() {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path={APP_ROUTES.HOME} element={<Home />} />
          <Route path={APP_ROUTES.PRODUCTS} element={<Products />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
