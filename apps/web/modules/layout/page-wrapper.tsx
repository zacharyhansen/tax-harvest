'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';

import { ErrorPage, LoadingPage } from '../utility-components';

export interface PageWrapperProps {
  description?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
  error?: any | null;
  loading?: boolean;
  className?: string;
  cornerElement?: ReactNode;
  next?: ReactNode;
  prev?: ReactNode;
}

export default function PageWrapper({
  children,
  title,
  description,
  error,
  loading,
  className,
  cornerElement,
  next,
  prev,
}: Readonly<PageWrapperProps>) {
  if (error) {
    console.error({ error });
    return (
      <ErrorPage
        message=" There was an error loading your data. If this issue persists please
        contact our support"
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex max-w-full flex-grow flex-col overflow-auto px-4 py-2',
        className
      )}
    >
      {(next ?? prev) ? (
        <div className="flex pb-4">
          {prev ? <div>{prev}</div> : null}
          {next ? <div className="ml-auto">{next}</div> : null}
        </div>
      ) : null}
      <div className="flex">
        {(title ?? description) ? (
          <div className={clsx('w-full py-2')}>
            {title ? (
              <h3 className="text-foreground flex items-center space-y-4 text-xl font-semibold">
                {title}
                {loading ? <LoadingPage /> : null}
              </h3>
            ) : null}
            {description ? (
              <div className="text-muted-foreground text-sm">{description}</div>
            ) : null}
          </div>
        ) : null}
        {cornerElement ? <div className="ml-auto">{cornerElement}</div> : null}
      </div>
      {children}
    </div>
  );
}
