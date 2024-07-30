import { Route, Routes } from 'react-router-dom';

import { Dashboard } from './pages';
import APP_ROUTES from './utils/routes';

function App() {
  return (
    <>
      <Routes>
        <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
