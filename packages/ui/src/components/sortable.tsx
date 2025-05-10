"use client";

import type {
  DndContextProps,
  DraggableSyntheticListeners,
  DropAnimation,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { SortableContextProps } from "@dnd-kit/sortable";
import type { SlotProps } from "@radix-ui/react-slot";
import type { ButtonProps } from "./button";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { createPortal } from "react-dom";
import { cn } from "../utils";

import { composeRefs as composeReferences } from "../utils/compose-references";
import { Button } from "./button";

const orientationConfig = {
  vertical: {
    modifiers: [restrictToVerticalAxis, restrictToParentElement],
    strategy: verticalListSortingStrategy,
  },
  horizontal: {
    modifiers: [restrictToHorizontalAxis, restrictToParentElement],
    strategy: horizontalListSortingStrategy,
  },
  mixed: {
    modifiers: [restrictToParentElement],
    strategy: undefined,
  },
};

type SortableProps<TData extends { id: UniqueIdentifier }> = {
  /**
   * An array of data items that the sortable component will render.
   * @example
   * value={[
   *   { id: 1, name: 'Item 1' },
   *   { id: 2, name: 'Item 2' },
   * ]}
   */
  value: TData[];

  /**
   * An optional callback function that is called when the order of the data items changes.
   * It receives the new array of items as its argument.
   * @example
   * onValueChange={(items) => console.log(items)}
   */
  onValueChange?: (items: TData[]) => void;

  /**
   * An optional callback function that is called when an item is moved.
   * It receives an event object with `activeIndex` and `overIndex` properties, representing the original and new positions of the moved item.
   * This will override the default behavior of updating the order of the data items.
   * @type (event: { activeIndex: number; overIndex: number }) => void
   * @example
   * onMove={(event) => console.log(`Item moved from index ${event.activeIndex} to index ${event.overIndex}`)}
   */
  onMove?: (event: { activeIndex: number; overIndex: number }) => void;

  /**
   * A collision detection strategy that will be used to determine the closest sortable item.
   * @default closestCenter
   * @type DndContextProps["collisionDetection"]
   */
  collisionDetection?: DndContextProps["collisionDetection"];

  /**
   * An array of modifiers that will be used to modify the behavior of the sortable component.
   * @default
   * [restrictToVerticalAxis, restrictToParentElement]
   * @type Modifier[]
   */
  modifiers?: DndContextProps["modifiers"];

  /**
   * A sorting strategy that will be used to determine the new order of the data items.
   * @default verticalListSortingStrategy
   * @type SortableContextProps["strategy"]
   */
  strategy?: SortableContextProps["strategy"];

  /**
   * Specifies the axis for the drag-and-drop operation. It can be "vertical", "horizontal", or "both".
   * @default "vertical"
   * @type "vertical" | "horizontal" | "mixed"
   */
  orientation?: "vertical" | "horizontal" | "mixed";

  /**
   * An optional React node that is rendered on top of the sortable component.
   * It can be used to display additional information or controls.
   * @default null
   * @type React.ReactNode | null
   * @example
   * overlay={<Skeleton className="w-full h-8" />}
   */
  overlay?: React.ReactNode | null;
} & DndContextProps;

function Sortable<TData extends { id: UniqueIdentifier }>({
  value,
  onValueChange,
  collisionDetection = closestCenter,
  modifiers,
  strategy,
  onMove,
  orientation = "vertical",
  overlay,
  children,
  ...props
}: Readonly<SortableProps<TData>>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const config = orientationConfig[orientation];

  // Create a container ref to properly calculate positions
  const containerReference = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerReference} className="relative">
      <DndContext
        modifiers={modifiers ?? config.modifiers}
        sensors={sensors}
        onDragStart={({ active }) => {
          setActiveId(active.id);
        }}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            const activeIndex = value.findIndex(
              (item) => item.id === active.id,
            );
            const overIndex = value.findIndex((item) => item.id === over.id);

            if (onMove) {
              onMove({ activeIndex, overIndex });
            } else {
              onValueChange?.(arrayMove(value, activeIndex, overIndex));
            }
          }
          setActiveId(null);
        }}
        onDragCancel={() => {
          setActiveId(null);
        }}
        collisionDetection={collisionDetection}
        {...props}
      >
        <SortableContext items={value} strategy={strategy ?? config.strategy}>
          {children}
        </SortableContext>
        {overlay && typeof window !== "undefined"
          ? createPortal(
              // eslint-disable-next-line ts/no-use-before-define
              <SortableOverlay activeId={activeId}>{overlay}</SortableOverlay>,
              document.body,
            )
          : null}
      </DndContext>
    </div>
  );
}

const dropAnimationOptions: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

type SortableOverlayProps = {
  activeId?: UniqueIdentifier | null;
} & React.ComponentPropsWithRef<typeof DragOverlay>;

const SortableOverlay = ({
  ref,
  activeId,
  dropAnimation = dropAnimationOptions,
  children,
  ...props
}: SortableOverlayProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <DragOverlay dropAnimation={dropAnimation} {...props}>
      {activeId ? (
        // eslint-disable-next-line ts/no-use-before-define
        <SortableItem
          ref={ref}
          value={activeId}
          className="cursor-grabbing"
          asChild
        >
          {children}
          {/* eslint-disable-next-line ts/no-use-before-define */}
        </SortableItem>
      ) : null}
    </DragOverlay>
  );
};
SortableOverlay.displayName = "SortableOverlay";

type SortableItemContextProps = {
  attributes: React.HTMLAttributes<HTMLElement>;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
};

const SortableItemContext = React.createContext<SortableItemContextProps>({
  attributes: {},
  listeners: undefined,
  isDragging: false,
});

function useSortableItem() {
  const context = React.use(SortableItemContext);

  if (!context) {
    throw new Error("useSortableItem must be used within a SortableItem");
  }

  return context;
}

type SortableItemProps = {
  /**
   * The unique identifier of the item.
   * @example "item-1"
   * @type UniqueIdentifier
   */
  value: UniqueIdentifier;

  /**
   * Specifies whether the item should act as a trigger for the drag-and-drop action.
   * @default false
   * @type boolean | undefined
   */
  asTrigger?: boolean;

  /**
   * Merges the item's props into its immediate child.
   * @default false
   * @type boolean | undefined
   */
  asChild?: boolean;
} & SlotProps;

const SortableItem = ({
  ref,
  value,
  asTrigger,
  asChild,
  className,
  ...props
}: SortableItemProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value });

  const context = React.useMemo<SortableItemContextProps>(
    () => ({
      attributes,
      listeners,
      isDragging,
    }),
    [attributes, listeners, isDragging],
  );
  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const Comp = asChild ? Slot : "div";

  return (
    <SortableItemContext value={context}>
      <Comp
        data-state={isDragging ? "dragging" : undefined}
        className={cn(
          "data-[state=dragging]:cursor-grabbing",
          { "cursor-grab": !isDragging && asTrigger },
          className,
        )}
        ref={composeReferences(ref, setNodeRef as React.Ref<HTMLDivElement>)}
        style={style}
        {...(asTrigger ? attributes : {})}
        {...(asTrigger ? listeners : {})}
        {...props}
      />
    </SortableItemContext>
  );
};
SortableItem.displayName = "SortableItem";

type SortableDragHandleProps = {
  withHandle?: boolean;
} & ButtonProps;

const SortableDragHandle = ({
  ref,
  className,
  ...props
}: SortableDragHandleProps & {
  ref?: React.RefObject<HTMLButtonElement | null>;
}) => {
  const { attributes, listeners, isDragging } = useSortableItem();

  return (
    <Button
      // @ts-expect-error - ref is not required
      ref={composeReferences(ref)}
      data-state={isDragging ? "dragging" : undefined}
      className={cn(
        "cursor-grab data-[state=dragging]:cursor-grabbing",
        className,
      )}
      {...attributes}
      {...listeners}
      {...props}
    />
  );
};

SortableDragHandle.displayName = "SortableDragHandle";

export { Sortable, SortableDragHandle, SortableItem, SortableOverlay };
