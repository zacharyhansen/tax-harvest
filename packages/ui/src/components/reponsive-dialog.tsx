'use client';
// see https://credenza.rdev.pro/

import type * as React from 'react';

import { useIsMobile } from '../hooks/use-is-mobile';
import { cn } from '../utils';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

type BaseProps = {
  children: React.ReactNode;
};

export type RootResponsiveDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & BaseProps;

export type ResponsiveDialogProps = {
  className?: string;
  asChild?: true;
} & BaseProps;

function ResponsiveDialog({
  children,
  ...props
}: RootResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialog = isDesktop ? Dialog : Drawer;

  return <ResponsiveDialog {...props}>{children}</ResponsiveDialog>;
}

function ResponsiveDialogTrigger({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogTrigger = isDesktop ? DialogTrigger : DrawerTrigger;

  return (
    <ResponsiveDialogTrigger className={className} {...props}>
      {children}
    </ResponsiveDialogTrigger>
  );
}

function ResponsiveDialogClose({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogClose = isDesktop ? DialogClose : DrawerClose;

  return (
    <ResponsiveDialogClose className={className} {...props}>
      {children}
    </ResponsiveDialogClose>
  );
}

function ResponsiveDialogContent({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogContent = isDesktop ? DialogContent : DrawerContent;

  return (
    <ResponsiveDialogContent
      className={cn('max-h-screen overflow-auto', className)}
      {...props}
    >
      {children}
    </ResponsiveDialogContent>
  );
}

function ResponsiveDialogDescription({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogDescription = isDesktop
    ? DialogDescription
    : DrawerDescription;

  return (
    <ResponsiveDialogDescription className={className} {...props}>
      {children}
    </ResponsiveDialogDescription>
  );
}

function ResponsiveDialogHeader({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogHeader = isDesktop ? DialogHeader : DrawerHeader;

  return (
    <ResponsiveDialogHeader className={className} {...props}>
      {children}
    </ResponsiveDialogHeader>
  );
}

function ResponsiveDialogTitle({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogTitle = isDesktop ? DialogTitle : DrawerTitle;

  return (
    <ResponsiveDialogTitle className={className} {...props}>
      {children}
    </ResponsiveDialogTitle>
  );
}

function ResponsiveDialogBody({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  return (
    <div className={cn('overflow-auto px-4 md:px-1', className)} {...props}>
      {children}
    </div>
  );
}

function ResponsiveDialogFooter({
  className,
  children,
  ...props
}: ResponsiveDialogProps) {
  const isDesktop = !useIsMobile();
  const ResponsiveDialogFooter = isDesktop ? DialogFooter : DrawerFooter;

  return (
    <ResponsiveDialogFooter className={className} {...props}>
      {children}
    </ResponsiveDialogFooter>
  );
}

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
