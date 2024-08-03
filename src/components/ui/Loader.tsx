// src/components/Loader.tsx

import classNames from 'classnames';
import React from 'react';

interface LoaderProps {
  size?: 'tiny' | 'small' | 'default' | 'large';
  loading?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ size = 'default', loading }) => {
  const sizeClass = classNames({
    'w-4 h-4 border-2': size === 'tiny',
    'w-5 h-5 border-2': size === 'small',
    'w-8 h-8 border-2': size === 'default',
    'w-12 h-12 border-4': size === 'large',
  });
  if (!loading) return null;
  return (
    <div className="flex justify-center items-center">
      <div
        className={classNames(
          sizeClass,
          'border-t-transparent border-solid border-green-500 rounded-full animate-spin',
        )}
      ></div>
    </div>
  );
};

export default Loader;
