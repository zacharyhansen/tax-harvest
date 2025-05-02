'use client';

import { type ReactNode, Children } from 'react';
import clsx from 'clsx';
import { ScrollArea } from '@repo/ui/components/scroll-area';

import type { PageWrapperProps } from './page-wrapper';
import PageWrapper from './page-wrapper';

export default function PageWrapperWithNav({
  children,
  ...pageWrapperProps
}: Readonly<PageWrapperProps>) {
  const childrenArray = Children.toArray(children).slice(0, 2);

  return (
    <div
      className={clsx('flex overflow-auto')}
      style={{ height: 'calc(100vh - 3rem)' }} // default is little less than the screen to account for the header bar
    >
      <PageWrapper {...pageWrapperProps} className="h-full flex-1">
        {childrenArray[0]}
      </PageWrapper>
      <nav className="w-72 border-l">
        <ScrollArea className="h-full px-2 py-4">{childrenArray[1]}</ScrollArea>
      </nav>
    </div>
  );
}

export function PageNavTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 text-center text-lg font-semibold">{children}</h2>;
}
