'use client';

import type React from 'react';
import { createContext, use, useMemo } from 'react';

import { useIsMobile } from '../hooks/use-is-mobile';

export type MediaContextProps = {
  isDesktop?: boolean;
};

export const MediaContext = createContext<MediaContextProps>({});

export type MediaProviderProps = {
  children: React.ReactNode;
  isDesktop?: boolean;
} & MediaContextProps;

// eslint-disable-next-line react-refresh/only-export-components
export const useMedia = (): MediaContextProps => {
  const context = use(MediaContext);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};

export default function MediaProvider({
  children,
}: Readonly<MediaProviderProps>) {
  const isDesktopResult = !useIsMobile();

  const value = useMemo(
    () => ({ isDesktop: isDesktopResult }),
    [isDesktopResult],
  );

  return (
    <MediaContext value={value}>{children}</MediaContext>
  );
}
