import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/index.css';

import AppRoutes from './App.tsx';
import ThemeProvider from './settings/ThemeProvider.tsx';

export function WrappedApp() {
  const queryClientRef = useRef<any>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClientRef.current}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>,
);
