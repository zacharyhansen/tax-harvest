import { Asterisk, Info, Pencil, Rows3, Trash2 } from 'lucide-react';
import type { NodeViewProps } from '@tiptap/core';
import { Fragment } from 'react/jsx-runtime';
import { snakeCase } from 'change-case';

import type { BaseFormNodeAttributes } from '../types';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';
import { Button } from '@repo/ui/components/button';
import {
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@repo/ui/components/reponsive-dialog';

interface FooterProps {
  isDirty?: boolean;
  setOpen: (open: boolean) => void;
}

export function Footer({ isDirty, setOpen }: Readonly<FooterProps>) {
  return (
    <ResponsiveDialogFooter>
      <Button
        variant="secondary"
        onClick={() => {
          setOpen(false);
        }}
        type="button"
      >
        Cancel
      </Button>
      <Button disabled={!isDirty} type="submit">
        Save
      </Button>
    </ResponsiveDialogFooter>
  );
}

interface InfoAndDeleteIconProps extends NodeViewProps {
  defaultValue: string | number | boolean;
  name: string;
}

export function InfoAndDeleteIcons({
  defaultValue,
  name,
  editor,
  node,
  getPos,
}: Readonly<InfoAndDeleteIconProps>) {
  const nodeEndPos = getPos() + node.nodeSize;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="text-muted hover:text-foreground hover:bg-muted h-6 w-6 cursor-pointer rounded-lg p-1" />
        </TooltipTrigger>
        <TooltipContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            {[
              { label: 'Slug:', value: name },
              { label: 'Default value:', value: defaultValue },
            ].map(item => (
              <Fragment key={item.label}>
                <dt className="text-muted-foreground font-medium">
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </Fragment>
            ))}
          </dl>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Trash2
            onClick={() => {
              editor
                .chain()
                .deleteRange({
                  to: nodeEndPos,
                  from: getPos(),
                })
                .run();
            }}
            className="hover:bg-muted h-6 w-6 cursor-pointer rounded-lg p-1 text-red-400"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove Field</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}

export function OptionsIcon() {
  return (
    <ResponsiveDialogTrigger asChild>
      <Rows3 className="text-muted hover:bg-muted hover:text-foreground h-6 w-6 cursor-pointer rounded-lg p-1" />
    </ResponsiveDialogTrigger>
  );
}

export function LabelInput({
  updateAttributes,
  node,
  onKeyDown,
}: Readonly<
  NodeViewProps & { onKeyDown: (event: React.KeyboardEvent) => void }
>) {
  const { required, label, nameLocked, name } =
    node.attrs as BaseFormNodeAttributes;

  return (
    <>
      <div
        onKeyDown={onKeyDown}
        contentEditable="true"
        suppressContentEditableWarning
        onBlur={event => {
          updateAttributes({
            label: event.currentTarget.textContent,
            name: nameLocked
              ? name
              : snakeCase(event.currentTarget.textContent ?? name),
          });
        }}
        className="w-fit min-w-12 pr-1 text-sm font-medium leading-none outline-none"
        aria-placeholder="Add a label"
      >
        {label}
      </div>
      {required ? (
        <Tooltip>
          <TooltipTrigger
            asChild
            onClick={() => {
              updateAttributes({
                required: !required,
              });
            }}
          >
            <Asterisk className="text-muted-foreground hover:bg-muted hover:text-foreground h-6 w-6 cursor-pointer rounded-lg p-1" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Required</p>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
}

export function PencilIcon() {
  return (
    <ResponsiveDialogTrigger asChild>
      <Pencil className="text-muted hover:bg-muted hover:text-foreground h-6 w-6 cursor-pointer rounded-lg p-1" />
    </ResponsiveDialogTrigger>
  );
}

export function Header() {
  return (
    <ResponsiveDialogHeader>
      <ResponsiveDialogTitle>Edit</ResponsiveDialogTitle>
      <ResponsiveDialogDescription>
        Manage all attributes of the field.
      </ResponsiveDialogDescription>
    </ResponsiveDialogHeader>
  );
}
