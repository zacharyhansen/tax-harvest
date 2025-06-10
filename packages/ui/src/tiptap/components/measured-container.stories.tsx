import type { Meta, StoryObj } from "@storybook/react";
import { SlashCmd, SlashCmdProvider } from "@harshtalks/slash-tiptap";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { LinkBubbleMenu } from "@repo/ui/tiptap/components/bubble-menu/link-bubble-menu";

import { MeasuredContainer } from "@repo/ui/tiptap/components/measured-container";
import { TiptapBasic } from "@repo/ui/tiptap/molecules/tiptap-form-builder";

import { cn } from "@repo/ui/utils";
import { EditorContent } from "@tiptap/react";
import { defaultCommands } from "../extensions/slash-command-lists/default.commands";
import { useTiptapEditor } from "../hooks/use-tiptap";

const meta = {
  title: "TipTap/Atoms/Measured Container",
  args: {
    throttleDelay: 1000,
    className: cn("h-full min-h-56 w-full rounded-xl"),
    editorContentClassName: "overflow-auto h-full",
    output: "html",
    placeholder: "Comment here...",
    editable: true,
    editorClassName: "focus:outline-hidden p-4 h-full",
    onChange: (value) => {
      console.info(value);
    },
  },
  tags: ["autodocs"],
  component: TiptapBasic,
  parameters: {
    layout: "centered",
  },
  render: ({
    className,
    ref,
    value,
    onChange,
    editorContentClassName,
    ...props
  }) => {
    const editor = useTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    if (!editor) {
      return <div>There was an error</div>;
    }

    return (
      <TooltipProvider>
        <SlashCmdProvider>
          <MeasuredContainer
            as="div"
            name="editor"
            ref={ref}
            className={cn("flex h-auto min-h-72 w-full flex-col", className)}
          >
            <EditorContent
              editor={editor}
              className={cn("minimal-tiptap-editor", editorContentClassName, {
                "minimal-tiptap-editor-slash-command": props.slashCommand,
              })}
            />
            <LinkBubbleMenu editor={editor} />
            {props.slashCommand || !props.editable ? (
              <SlashCmd.Root editor={editor}>
                <SlashCmd.Cmd className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-muted bg-background  p-4 shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px] transition-all">
                  <SlashCmd.Empty>No commands available</SlashCmd.Empty>
                  <SlashCmd.List>
                    {defaultCommands.map((item) => {
                      return (
                        <SlashCmd.Item
                          value={item.title}
                          onCommand={(value_) => {
                            item.command(value_);
                          }}
                          key={item.title}
                          className="flex w-full cursor-pointer items-center space-x-2 rounded-lg p-2 text-left text-sm hover:bg-gray-200 aria-selected:bg-gray-200"
                        >
                          <p>{item.title}</p>
                        </SlashCmd.Item>
                      );
                    })}
                  </SlashCmd.List>
                </SlashCmd.Cmd>
              </SlashCmd.Root>
            ) : null}
          </MeasuredContainer>
        </SlashCmdProvider>
      </TooltipProvider>
    );
  },
} satisfies Meta<typeof TiptapBasic>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {},
};
