import type { NodeViewProps } from '@tiptap/core';

export const useFormKeyDown = (props: NodeViewProps) => {
  const { node, getPos } = props;
  const nodeEndPos = getPos() + node.nodeSize;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      props.editor
        .chain()
        .focus(nodeEndPos)
        .insertContent([
          {
            type: 'paragraph',
          },
        ])
        .run();
    }
  };

  return { handleKeyDown };
};
