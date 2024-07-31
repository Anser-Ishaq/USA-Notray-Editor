import { Route, Routes } from 'react-router-dom';

import APP_ROUTES from '@/utils/routes';

import { Dashboard } from './pages';

function App() {
  return (
    <>
      <Routes>
        <Route path={APP_ROUTES.EDITOR} element={<Dashboard />} />
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
