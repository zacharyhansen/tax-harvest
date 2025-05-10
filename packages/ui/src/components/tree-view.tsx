"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import React from "react";

import { cn } from "../utils";

const treeVariants = cva(
  "group px-2 before:absolute before:left-0 before:-z-10 before:h-8 before:w-full before:rounded-lg before:bg-accent/70 before:opacity-0 hover:before:opacity-100",
);

const selectedTreeVariants = cva(
  "text-accent-foreground before:bg-accent/70 before:opacity-100",
);

type TreeDataItem = {
  id: string;
  name: ReactNode;
  // eslint-disable-next-line ts/no-explicit-any
  icon?: any;
  // eslint-disable-next-line ts/no-explicit-any
  selectedIcon?: any;
  // eslint-disable-next-line ts/no-explicit-any
  openIcon?: any;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
};

type TreeItemAction = {
  icon: LucideIcon;
  label?: string;
  onClick: (id: string) => void;
};

type TreeViewProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  // eslint-disable-next-line ts/no-explicit-any
  defaultNodeIcon?: any;
  // eslint-disable-next-line ts/no-explicit-any
  defaultLeafIcon?: any;
  hideActionsTillHover?: boolean;
  nodeClassName?: string;
  leafClassName?: string;
};

const TreeView = ({
  ref,
  data,
  initialSelectedItemId,
  onSelectChange,
  expandAll,
  defaultLeafIcon,
  defaultNodeIcon,
  className,
  hideActionsTillHover = false,
  ...props
}: TreeViewProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const [selectedItemId, setSelectedItemId] = React.useState<
    string | undefined
  >(initialSelectedItemId);

  const handleSelectChange = React.useCallback(
    (item: TreeDataItem | undefined) => {
      setSelectedItemId(item?.id);
      if (onSelectChange) {
        onSelectChange(item);
      }
    },
    [onSelectChange],
  );

  const expandedItemIds = React.useMemo(() => {
    if (!initialSelectedItemId) {
      return [] as string[];
    }

    const ids: string[] = [];

    function walkTreeItems(
      items: TreeDataItem[] | TreeDataItem,
      targetId: string,
    ) {
      if (Array.isArray(items)) {
        for (const item of items) {
          ids.push(item.id);
          if (walkTreeItems(item, targetId) && !expandAll) {
            return true;
          }
          if (!expandAll) {
            ids.pop();
          }
        }
      } else if (!expandAll && items.id === targetId) {
        return true;
      } else if (items.children) {
        return walkTreeItems(items.children, targetId);
      }
    }

    walkTreeItems(data, initialSelectedItemId);
    return ids;
  }, [data, expandAll, initialSelectedItemId]);

  return (
    <div className={cn("relative overflow-hidden p-2", className)}>
      {/* eslint-disable-next-line ts/no-use-before-define */}
      <TreeItem
        data={data}
        ref={ref}
        selectedItemId={selectedItemId}
        handleSelectChange={handleSelectChange}
        expandedItemIds={expandedItemIds}
        defaultLeafIcon={defaultLeafIcon}
        defaultNodeIcon={defaultNodeIcon}
        hideActionsTillHover={hideActionsTillHover}
        {...props}
      />
    </div>
  );
};
TreeView.displayName = "TreeView";

type TreeItemProps = TreeViewProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  // eslint-disable-next-line ts/no-explicit-any
  defaultNodeIcon?: any;
  // eslint-disable-next-line ts/no-explicit-any
  defaultLeafIcon?: any;
  nodeClassName?: string;
  leafClassName?: string;
  hideActionsTillHover: boolean;
};

const TreeItem = ({
  ref,
  className,
  data,
  selectedItemId,
  handleSelectChange,
  expandedItemIds,
  defaultNodeIcon,
  defaultLeafIcon,
  hideActionsTillHover,
  nodeClassName,
  leafClassName,
  ...props
}: TreeItemProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  return (
    <div ref={ref} role="tree" className={className} {...props}>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.children ? (
              <TreeNode
                item={item}
                selectedItemId={selectedItemId}
                expandedItemIds={expandedItemIds}
                handleSelectChange={handleSelectChange}
                defaultNodeIcon={defaultNodeIcon}
                defaultLeafIcon={defaultLeafIcon}
                nodeClassName={nodeClassName}
                leafClassName={leafClassName}
              />
            ) : (
              //  eslint-disable-next-line ts/no-use-before-define
              <TreeLeaf
                item={item}
                selectedItemId={selectedItemId}
                handleSelectChange={handleSelectChange}
                defaultLeafIcon={defaultLeafIcon}
                hideActionsTillHover={hideActionsTillHover}
                leafClassName={leafClassName}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
TreeItem.displayName = "TreeItem";

function TreeNode({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  hideActionsTillHover = false,
  nodeClassName,
  leafClassName,
}: {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string;
  // eslint-disable-next-line ts/no-explicit-any
  defaultNodeIcon?: any;
  // eslint-disable-next-line ts/no-explicit-any
  defaultLeafIcon?: any;
  hideActionsTillHover?: boolean;
  nodeClassName?: string;
  leafClassName?: string;
}) {
  const [value, setValue] = React.useState(
    expandedItemIds.includes(item.id) ? [item.id] : [],
  );
  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={value}
      onValueChange={(s) => {
        setValue(s);
      }}
    >
      <AccordionPrimitive.Item value={item.id}>
        {/* eslint-disable-next-line ts/no-use-before-define */}
        <AccordionTrigger
          className={cn(
            treeVariants(),
            selectedItemId === item.id && selectedTreeVariants(),
          )}
          onClick={() => {
            handleSelectChange(item);
            item.onClick?.();
          }}
        >
          <TreeIcon
            item={item}
            isSelected={selectedItemId === item.id}
            isOpen={value.includes(item.id)}
            default={defaultNodeIcon}
          />
          <span className="truncate text-sm">{item.name}</span>
          <TreeActions
            isSelected={selectedItemId === item.id}
            hideActionsTillHover={hideActionsTillHover}
          >
            {item.actions}
          </TreeActions>
          {/* eslint-disable-next-line ts/no-use-before-define */}
        </AccordionTrigger>
        {/* eslint-disable-next-line ts/no-use-before-define */}
        <AccordionContent className="ml-4 border-l pl-1">
          <TreeItem
            data={item.children ? item.children : item}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            hideActionsTillHover={hideActionsTillHover}
            nodeClassName={nodeClassName}
            leafClassName={leafClassName}
          />
          {/* eslint-disable-next-line ts/no-use-before-define */}
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}

const TreeLeaf = ({
  ref,
  className,
  item,
  selectedItemId,
  handleSelectChange,
  defaultLeafIcon,
  hideActionsTillHover,
  leafClassName,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  item: TreeDataItem;
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  // eslint-disable-next-line ts/no-explicit-any
  defaultLeafIcon?: any;
  hideActionsTillHover: boolean;
  leafClassName?: string;
} & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={ref}
      className={cn(
        "ml-5 flex cursor-pointer items-center py-2 text-left before:right-1",
        treeVariants(),
        className,
        selectedItemId === item.id && selectedTreeVariants(),
        leafClassName,
      )}
      onClick={() => {
        handleSelectChange(item);
        item.onClick?.();
      }}
      {...props}
    >
      <TreeIcon
        item={item}
        isSelected={selectedItemId === item.id}
        default={defaultLeafIcon}
      />
      <span className="grow truncate text-sm">{item.name}</span>
      <TreeActions
        isSelected={selectedItemId === item.id}
        hideActionsTillHover={hideActionsTillHover}
      >
        {item.actions}
      </TreeActions>
    </div>
  );
};
TreeLeaf.displayName = "TreeLeaf";

const AccordionTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  ref?: React.RefObject<React.ElementRef<
    typeof AccordionPrimitive.Trigger
  > | null>;
}) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full flex-1 items-center py-2 transition-all first:[&[data-state=open]>svg]:rotate-90",
        className,
      )}
      {...props}
    >
      <ChevronRight className="mr-1 size-4 shrink-0 text-accent-foreground/50 transition-transform duration-200" />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof AccordionPrimitive.Content
  > | null>;
}) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all",
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

function TreeIcon({
  item,
  isOpen,
  isSelected,
  default: defaultIcon,
}: {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  // eslint-disable-next-line ts/no-explicit-any
  default?: any;
}) {
  let Icon = defaultIcon;
  if (isSelected && item.selectedIcon) {
    Icon = item.selectedIcon;
  } else if (isOpen && item.openIcon) {
    Icon = item.openIcon;
  } else if (item.icon) {
    Icon = item.icon;
  }
  return Icon ? <Icon className="mr-2 size-4 shrink-0" /> : <></>;
}

function TreeActions({
  children,
  isSelected,
  hideActionsTillHover,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  hideActionsTillHover: boolean;
}) {
  return (
    <div
      className={cn(
        isSelected || !hideActionsTillHover ? "block" : "hidden",
        "absolute right-3 group-hover:block",
      )}
    >
      {children}
    </div>
  );
}

export { type TreeDataItem, type TreeItemAction, TreeView, type TreeViewProps };
