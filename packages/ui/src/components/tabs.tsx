'use client';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '../utils';

const Tabs = TabsPrimitive.Root;

const TabsList = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.List> | null>;
}) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'text-muted-foreground relative inline-flex items-center justify-center border-b',
      className
    )}
    {...props}
  />
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.Trigger> | null>;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'text-muted-foreground data-[state=active]:text-foreground ring-offset-background focus-visible:ring-ring data-[state=active]:border-primary flex cursor-pointer content-center items-center justify-center px-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="relative mb-1 flex h-full w-full items-center justify-center whitespace-nowrap px-2 py-1">
        {children}
        {isHovered && (
          <motion.div
            className="bg-secondary absolute inset-0 -z-10 rounded-md"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </TabsPrimitive.Trigger>
  );
};
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<typeof TabsPrimitive.Content> | null>;
}) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 hidden h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:flex',
      className
    )}
    {...props}
  />
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
