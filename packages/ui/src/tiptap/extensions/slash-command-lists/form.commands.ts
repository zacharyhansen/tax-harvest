import { createSuggestionsItems } from '@harshtalks/slash-tiptap';
import type { Editor, Range } from '@tiptap/core';

import {
  formCommandIcon,
  formCommandLabel,
  FormNode,
} from '../../nodes/form/types';

const selectLabel = ({ editor, range }: { editor: Editor; range: Range }) => {
  // After inserting the content, we set the selection (cursor) inside the editable part of the node
  const node = editor.view.nodeDOM(range.from - 1);
  // @ts-expect-error this works so gonna come back to it
  const editableDiv = node?.querySelector('div[contenteditable="true"]');

  if (editableDiv) {
    editableDiv.focus();
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editableDiv);
    range.collapse(false); // Move the cursor to the end of the content
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

const handleNodeInsert = ({
  editor,
  range,
  formNode,
}: {
  editor: Editor;
  range: Range;
  formNode: FormNode;
}) => {
  editor
    .chain()
    .deleteRange(range)
    .insertContentAt(range.from, [
      {
        type: formNode,
      },
    ])
    .run();
  selectLabel({ editor, range });
};

export const formCommands = createSuggestionsItems([
  {
    title: formCommandLabel[FormNode.Text],
    searchTerms: ['text', 'input', 'string'],
    icon: formCommandIcon[FormNode.Text],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Text });
    },
  },
  {
    title: formCommandLabel[FormNode.Number],
    searchTerms: ['number', 'input', 'integer', 'percent', 'decimal', 'dollar'],
    icon: formCommandIcon[FormNode.Number],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Number });
    },
  },
  {
    title: formCommandLabel[FormNode.Checkbox],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Checkbox],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Checkbox });
    },
  },
  {
    title: formCommandLabel[FormNode.ComboboxMulti],
    searchTerms: ['select', 'combo', 'option', 'multi'],
    icon: formCommandIcon[FormNode.ComboboxMulti],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.ComboboxMulti });
    },
  },
  {
    title: formCommandLabel[FormNode.Combobox],
    searchTerms: ['select', 'combo', 'option', 'single'],
    icon: formCommandIcon[FormNode.Combobox],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Combobox });
    },
  },
  {
    title: formCommandLabel[FormNode.DatePicker],
    searchTerms: [],
    icon: formCommandIcon[FormNode.DatePicker],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.DatePicker });
    },
  },
  {
    title: formCommandLabel[FormNode.DateRangePicker],
    searchTerms: [],
    icon: formCommandIcon[FormNode.DateRangePicker],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.DateRangePicker });
    },
  },
  {
    title: formCommandLabel[FormNode.Password],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Password],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Password });
    },
  },
  {
    title: formCommandLabel[FormNode.Phone],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Phone],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Phone });
    },
  },
  {
    title: formCommandLabel[FormNode.Slider],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Slider],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Slider });
    },
  },
  {
    title: formCommandLabel[FormNode.Switch],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Switch],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Switch });
    },
  },
  {
    title: formCommandLabel[FormNode.Textarea],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Textarea],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Textarea });
    },
  },

  {
    title: formCommandLabel[FormNode.Tiptap],
    searchTerms: [],
    icon: formCommandIcon[FormNode.Tiptap],
    command: ({ editor, range }) => {
      handleNodeInsert({ editor, range, formNode: FormNode.Tiptap });
    },
  },
]);
