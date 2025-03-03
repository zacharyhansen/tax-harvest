import type { ReactNode } from 'react';

import LoadingIcon from './loading-icon';

export const LoadingPage = ({ message }: { message?: ReactNode }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center justify-center space-x-1 text-sm">
        <LoadingIcon />
        <div>{message ?? 'Loading'}</div>
      </div>
    </div>
  );
};

export default LoadingPage;
