import * as React from 'react';
import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';

import type { ShouldShowProps } from '../../types';
import { LinkEditBlock } from '../link/link-edit-block';
import { LinkPopoverBlock } from '../link/link-popover-block';

interface LinkBubbleMenuProps {
  editor: Editor;
}

interface LinkAttributes {
  href: string;
  target: string;
}

export const LinkBubbleMenu: React.FC<LinkBubbleMenuProps> = ({ editor }) => {
  const [showEdit, setShowEdit] = React.useState(false);
  const [linkAttributes, setLinkAttributes] = React.useState<LinkAttributes>({
    href: '',
    target: '',
  });
  const [selectedText, setSelectedText] = React.useState('');

  const updateLinkState = React.useCallback(() => {
    const { from, to } = editor.state.selection;
    const { href, target } = editor.getAttributes('link');
    const text = editor.state.doc.textBetween(from, to, ' ');

    setLinkAttributes({ href, target });
    setSelectedText(text);
  }, [editor]);

  const shouldShow = React.useCallback(
    ({ editor, from, to }: ShouldShowProps) => {
      if (from === to) {
        return false;
      }
      const { href } = editor.getAttributes('link');

      if (href) {
        updateLinkState();
        return true;
      }
      return false;
    },
    [updateLinkState]
  );

  const handleEdit = React.useCallback(() => {
    setShowEdit(true);
  }, []);

  const onSetLink = React.useCallback(
    (url: string, text?: string, openInNewTab?: boolean) => {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .insertContent({
          type: 'text',
          text: text || url,
          marks: [
            {
              type: 'link',
              attrs: {
                href: url,
                target: openInNewTab ? '_blank' : '',
              },
            },
          ],
        })
        .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
        .run();
      setShowEdit(false);
      updateLinkState();
    },
    [editor, updateLinkState]
  );

  const onUnsetLink = React.useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowEdit(false);
    updateLinkState();
  }, [editor, updateLinkState]);

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: 'bottom-start',
        onHidden: () => {
          setShowEdit(false);
        },
      }}
    >
      {showEdit ? (
        <LinkEditBlock
          defaultUrl={linkAttributes.href}
          defaultText={selectedText}
          defaultIsNewTab={linkAttributes.target === '_blank'}
          onSave={onSetLink}
          className="bg-popover text-popover-foreground w-full min-w-80 rounded-lg border p-4 shadow-md outline-none"
        />
      ) : (
        <LinkPopoverBlock
          onClear={onUnsetLink}
          url={linkAttributes.href}
          onEdit={handleEdit}
        />
      )}
    </BubbleMenu>
  );
};
