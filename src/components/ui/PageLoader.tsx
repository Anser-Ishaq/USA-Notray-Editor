// src/components/PageLoader.tsx

import React from 'react';

import Loader from '@/components/ui/Loader';

interface PageLoaderProps {
  loading?: boolean;
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ loading, message }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
      <Loader size="default" loading={loading} />

      {message && (
        <div className="text-h5 text-light ml-6 font-heading">{message}</div>
      )}
    </div>
  );
};

export default PageLoader;
