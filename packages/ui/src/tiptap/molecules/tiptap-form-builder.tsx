import * as React from 'react';
import type { Content, Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';
import { SlashCmd, SlashCmdProvider } from '@harshtalks/slash-tiptap';

import { defaultCommands } from '../extensions/slash-command-lists/default.commands';
import {
  useTiptapEditor,
  type UseTiptapEditorProps,
} from '../hooks/use-tiptap';

import { SectionOne } from '@repo/ui/tiptap/components/section/one';
import { SectionThree } from '@repo/ui/tiptap/components/section/three';
import { SectionFour } from '@repo/ui/tiptap/components/section/four';
import { SectionFive } from '@repo/ui/tiptap/components/section/five';
import { MeasuredContainer } from '@repo/ui/tiptap/components/measured-container';
import { SectionTwo } from '@repo/ui/tiptap/components/section/two';
import { LinkBubbleMenu } from '@repo/ui/tiptap/components/bubble-menu/link-bubble-menu';
import { Separator } from '@repo/ui/components/separator';
import { cn } from '@repo/ui/utils';

export interface TiptapBasicProps
  extends Omit<UseTiptapEditorProps, 'onUpdate'> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  slashCommand?: boolean;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border shrink-0 overflow-x-auto border-b p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'clearFormatting',
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const TiptapBasic = React.forwardRef<HTMLDivElement, TiptapBasicProps>(
  (
    {
      value,
      onChange,
      className,
      editorClassName,
      editorContentClassName,
      ...props
    },
    ref
  ) => {
    const editor = useTiptapEditor({
      value,
      onUpdate: onChange,
      editorClassName: cn(
        'h-full px-5 py-4 focus:outline-none',
        editorClassName
      ),
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
          className={cn(
            'border-input focus-within:border-primary flex h-auto min-h-56 w-full flex-col rounded-lg border shadow-sm',
            className
          )}
        >
          {props.editable === false ? null : <Toolbar editor={editor} />}
          <EditorContent
            editor={editor}
            className={cn('minimal-tiptap-editor', editorContentClassName, {
              'minimal-tiptap-editor-slash-command': props.slashCommand,
            })}
          />
          <LinkBubbleMenu editor={editor} />
          {props.slashCommand || !props.editable ? (
            <SlashCmd.Root editor={editor}>
              <SlashCmd.Cmd className="border-muted bg-background z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border bg-white p-4 shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] transition-all">
                <SlashCmd.Empty>No commands available</SlashCmd.Empty>
                <SlashCmd.List>
                  {defaultCommands.map(item => {
                    return (
                      <SlashCmd.Item
                        value={item.title}
                        onCommand={value_ => {
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
    );
  }
);

TiptapBasic.displayName = 'TiptapBasic';
