'use client';

import type { ReactNode } from 'react';
import clsx from 'clsx';
import type { PostgrestError } from '@supabase/postgrest-js';

import { ErrorPage, LoadingPage } from '../utility-components';

import type { TablesConfiguration } from '~/lib/database/helpers';
import type { LayoutSlug } from '~/lib/constants/layout.slugs';

export interface PageWrapperProps {
  height?: string;
  description?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  error?: PostgrestError | null;
  loading?: boolean;
  layout?: TablesConfiguration<'layout'>;
  layoutSlug?: LayoutSlug;
  className?: string;
}

export default function PageWrapper({
  children,
  height,
  title,
  description,
  error,
  loading,
  className,
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
        'bg-primary-foreground flex flex-col overflow-auto px-4 py-2',
        className
      )}
      style={{ height: height ?? 'calc(100vh - 3rem)' }} // default is little less than the screen to account for the header bar
    >
      {(title ?? description) ? (
        <div className="flex">
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
        </div>
      ) : null}
      {children}
    </div>
  );
}
