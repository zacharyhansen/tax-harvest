import { createSuggestionsItems } from '@harshtalks/slash-tiptap';
import { LetterText, List, ListOrdered } from 'lucide-react';

export const defaultCommands = createSuggestionsItems([
  {
    title: 'Paragraph',
    searchTerms: ['paragraph'],
    icon: LetterText,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run();
    },
  },
  {
    title: 'Bullet List',
    searchTerms: ['unordered', 'point'],
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Ordered List',
    icon: ListOrdered,
    searchTerms: ['ordered', 'point', 'numbers'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
]);
