import type { Content, Editor } from "@tiptap/react";
import type { SlashCommands, UseTiptapEditorProps } from "../hooks/use-tiptap";
import { SlashCmd, SlashCmdProvider } from "@harshtalks/slash-tiptap";
import { Separator } from "@repo/ui/components/separator";
import { LinkBubbleMenu } from "@repo/ui/tiptap/components/bubble-menu/link-bubble-menu";

import { MeasuredContainer } from "@repo/ui/tiptap/components/measured-container";

import { SectionFive } from "@repo/ui/tiptap/components/section/five";

import { SectionFour } from "@repo/ui/tiptap/components/section/four";
import { SectionOne } from "@repo/ui/tiptap/components/section/one";
import { SectionThree } from "@repo/ui/tiptap/components/section/three";
import { SectionTwo } from "@repo/ui/tiptap/components/section/two";
import { cn } from "@repo/ui/utils";
import { EditorContent } from "@tiptap/react";
import { Search } from "lucide-react";
import * as React from "react";
import { useTiptapEditor } from "../hooks/use-tiptap";
import { tiptapBaseVariants } from "./tiptap-base.variants";

export type TiptapBaseProps = {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  variant?: "mini" | "max" | "default";
  slashCommands?: SlashCommands;
} & Omit<UseTiptapEditorProps, "onUpdate">;

export const TiptapBase = ({
  ref,
  value,
  onChange,
  className,
  editorClassName,
  editorContentClassName,
  variant = "default",
  ...props
}: TiptapBaseProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const editor = useTiptapEditor({
    value,
    onUpdate: onChange,
    editorClassName: cn("h-full px-5 py-4 focus:outline-hidden", editorClassName),
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <SlashCmdProvider>
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={cn(tiptapBaseVariants({ variant }), className)}
      >
        {/* TOP TOOLBAR */}
        {props.editable && variant !== "mini" ? (
          variant === "max" ? (
            <ToolbarMax editor={editor} />
          ) : (
            <ToolbarBasic editor={editor} />
          )
        ) : null}
        {/* EDITOR */}
        <EditorContent
          editor={editor}
          className={cn(
            "minimal-tiptap-editor h-full overflow-auto",
            {
              "minimal-tiptap-editor-slash-command":
                props.slashCommands?.length,
              "min-h-40": variant === "mini",
            },
            editorContentClassName,
          )}
        />
        {/* BOTTOM TOOLBAR */}
        {props.editable && variant === "mini" ? (
          <ToolbarMini editor={editor} />
        ) : null}
        {/* LINK BUBBLE */}
        <LinkBubbleMenu editor={editor} />
        {/* SLASH COMMANDS */}
        {props.slashCommands?.length && props.editable ? (
          <SlashCmd.Root editor={editor}>
            <SlashCmd.Cmd className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-muted bg-background p-1 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] transition-all">
              <SlashCmd.Empty className="flex w-full min-w-72 cursor-pointer items-center space-x-2 rounded-lg p-1 text-left text-sm">
                <Search size={18} className="mr-4" /> No search results
              </SlashCmd.Empty>
              <SlashCmd.List>
                {props.slashCommands.map(({ title, command, icon: Icon }) => {
                  return (
                    <SlashCmd.Item
                      value={title}
                      onCommand={(value_) => {
                        command(value_);
                      }}
                      key={title}
                      className="flex w-full min-w-72 cursor-pointer items-center space-x-2 rounded-lg p-1 text-left text-sm hover:bg-muted aria-selected:bg-secondary"
                    >
                      {/* @ts-expect-error its an icon */}
                      {Icon ? <Icon size={18} className="ml-2" /> : null}
                      <span>{title}</span>
                    </SlashCmd.Item>
                  );
                })}
              </SlashCmd.List>
            </SlashCmd.Cmd>
          </SlashCmd.Root>
        ) : null}
      </MeasuredContainer>
    </SlashCmdProvider>
  );
};

TiptapBase.displayName = "TiptapBase";

function ToolbarBasic({ editor }: { editor: Editor }) {
  return (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionTwo
          editor={editor}
          activeActions={[
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
            "clearFormatting",
          ]}
          mainActionCount={3}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionThree editor={editor} />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={["orderedList", "bulletList"]}
          mainActionCount={0}
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFive
          editor={editor}
          activeActions={["codeBlock", "blockquote", "horizontalRule"]}
          mainActionCount={0}
        />
      </div>
    </div>
  );
}

function ToolbarMini({ editor }: { editor: Editor }) {
  return (
    <div className="shrink-0 overflow-x-auto border-t border-border p-2">
      <div className="flex w-max items-center gap-px">
        <SectionTwo
          editor={editor}
          activeActions={[
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "code",
          ]}
          mainActionCount={5}
        />
      </div>
    </div>
  );
}

function ToolbarMax({ editor }: { editor: Editor }) {
  return (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne
          editor={editor}
          activeLevels={[1, 2, 3]}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionTwo
          editor={editor}
          activeActions={[
            "italic",
            "bold",
            "underline",
            "code",
            "strikethrough",
            "clearFormatting",
          ]}
          mainActionCount={5}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionThree editor={editor} variant="outline" />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFour
          editor={editor}
          activeActions={["bulletList", "orderedList"]}
          mainActionCount={2}
          variant="outline"
        />

        <Separator orientation="vertical" className="mx-2 h-7" />

        <SectionFive
          editor={editor}
          activeActions={["blockquote", "codeBlock", "horizontalRule"]}
          mainActionCount={3}
          variant="outline"
        />
      </div>
    </div>
  );
}
