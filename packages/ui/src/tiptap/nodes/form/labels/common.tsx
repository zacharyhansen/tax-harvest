import type { NodeViewProps } from "@tiptap/core";
import type { BaseFormNodeAttributes } from "../types";
import { Button } from "@repo/ui/components/button";
import {
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@repo/ui/components/reponsive-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

import { snakeCase } from "change-case";
import { Asterisk, Info, Pencil, Rows3, Trash2 } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type FooterProps = {
  isDirty?: boolean;
  setOpen: (open: boolean) => void;
};

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

type InfoAndDeleteIconProps = {
  defaultValue: string | number | boolean;
  name: string;
} & NodeViewProps;

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
          <Info className="size-6 cursor-pointer rounded-lg p-1 text-muted hover:bg-muted hover:text-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            {[
              { label: "Slug:", value: name },
              { label: "Default value:", value: defaultValue },
            ].map((item) => (
              <Fragment key={item.label}>
                <dt className="font-medium text-muted-foreground">
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
            className="size-6 cursor-pointer rounded-lg p-1 text-red-400 hover:bg-muted"
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
      <Rows3 className="size-6 cursor-pointer rounded-lg p-1 text-muted hover:bg-muted hover:text-foreground" />
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
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onKeyDown={onKeyDown}
        contentEditable="true"
        suppressContentEditableWarning
        onBlur={(event) => {
          updateAttributes({
            label: event.currentTarget.textContent,
            name: nameLocked
              ? name
              : snakeCase(event.currentTarget.textContent ?? name),
          });
        }}
        className="w-fit min-w-12 pr-1 text-sm font-medium leading-none outline-hidden"
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
            <Asterisk className="size-6 cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground" />
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
      <Pencil className="size-6 cursor-pointer rounded-lg p-1 text-muted hover:bg-muted hover:text-foreground" />
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
