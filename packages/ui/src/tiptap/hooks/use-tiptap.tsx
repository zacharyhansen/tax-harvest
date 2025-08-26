/** biome-ignore-all lint/suspicious/noExplicitAny: <ok> */
import type { createSuggestionsItems } from '@harshtalks/slash-tiptap';
import { enableKeyboardNavigation, Slash } from '@harshtalks/slash-tiptap';
import { cn } from '@repo/ui/utils';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import type { Content, Editor, UseEditorOptions } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import * as React from 'react';

import { toast } from 'sonner';
import {
	CodeBlockLowlight,
	Color,
	FileHandler,
	HorizontalRule,
	Image,
	Link,
	ResetMarksOnEnter,
	Selection,
	UnsetAllMarks,
} from '../extensions';
import GlobalDragHandle from '../extensions/drag-handler';
import { FormCheckboxNode } from '../nodes/form/form-checkbox.node';
import { FormComboboxNode } from '../nodes/form/form-combobox.node';
import { FormNumberNode } from '../nodes/form/form-number.node';
import { FormTextNode } from '../nodes/form/form-text.node';

import { fileToBase64, getOutput, randomId } from '../utils';

import { useThrottle } from './use-throttle';

export type SlashCommands = ReturnType<typeof createSuggestionsItems>;

export type UseTiptapEditorProps = {
	value?: Content;
	output?: 'html' | 'json' | 'text';
	placeholder?: string;
	editorClassName?: string;
	throttleDelay?: number;
	onUpdate?: (content: Content) => void;
	onBlur?: (content: Content) => void;
	slashCommands?: SlashCommands;
} & UseEditorOptions;

function createExtensions({
	placeholder,
	slashCommands,
}: {
	placeholder: string;
	slashCommands?: SlashCommands;
}) {
	const extensions = [
		// Form Nodes
		FormTextNode,
		FormNumberNode,
		FormCheckboxNode,
		FormComboboxNode,

		// Default
		Link,
		Underline,
		Color,
		TextStyle,
		Selection,
		Typography,
		UnsetAllMarks,
		HorizontalRule,
		ResetMarksOnEnter,
		CodeBlockLowlight,
		StarterKit.configure({
			horizontalRule: false,
			codeBlock: false,
			paragraph: { HTMLAttributes: { class: 'text-node' } },
			heading: { HTMLAttributes: { class: 'heading-node' } },
			blockquote: { HTMLAttributes: { class: 'block-node' } },
			bulletList: { HTMLAttributes: { class: 'list-node' } },
			orderedList: { HTMLAttributes: { class: 'list-node' } },
			code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
			dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
		}),
		Image.configure({
			allowedMimeTypes: ['image/*'],
			maxFileSize: 5 * 1024 * 1024,
			allowBase64: true,
			uploadFn: async (file: File | Blob) => {
				// NOTE: This is a fake upload function. Replace this with your own upload logic.
				// This function should return the uploaded image URL.

				// wait 3s to simulate upload
				await new Promise((resolve) => setTimeout(resolve, 3000));

				const source = await fileToBase64(file);

				// either return { id: string | number, src: string } or just src
				// return src;
				return { id: randomId(), src: source };
			},
			onToggle(
				editor: {
					commands: {
						insertContentAt: (argument0: any, argument1: any) => void;
					};
				},
				files: any[],
				pos: any,
			) {
				editor.commands.insertContentAt(
					pos,
					files.map((image: Blob | MediaSource) => {
						const blobUrl = URL.createObjectURL(image);
						const id = randomId();

						return {
							type: 'image',
							attrs: {
								id,
								src: blobUrl,
								// @ts-expect-error typing for tiptap
								alt: image.name,
								// @ts-expect-error typing for tiptap
								title: image.name,
								// @ts-expect-error typing for tiptap
								fileName: image.name,
							},
						};
					}),
				);
			},
			onImageRemoved({ id, src }) {
				console.info('Image removed', { id, src });
			},
			onValidationError(errors: any) {
				for (const error of errors) {
					toast.error('Image validation error', {
						position: 'bottom-right',
						description: error.reason,
					});
				}
			},
			onActionSuccess({ action }) {
				const mapping = {
					copyImage: 'Copy Image',
					copyLink: 'Copy Link',
					download: 'Download',
				};
				toast.success(mapping[action], {
					position: 'bottom-right',
					description: 'Image action success',
				});
			},
			onActionError(error: { message: any }, { action }: any) {
				const mapping = {
					copyImage: 'Copy Image',
					copyLink: 'Copy Link',
					download: 'Download',
				};
				// @ts-expect-error typing for tiptap
				toast.error(`Failed to ${mapping[action]}`, {
					position: 'bottom-right',
					description: error.message,
				});
			},
		}),
		FileHandler.configure({
			allowBase64: true,
			allowedMimeTypes: ['image/*'],
			maxFileSize: 5 * 1024 * 1024,
			onDrop: (editor, files, pos) => {
				files.forEach(async (file) => {
					const source = await fileToBase64(file);
					editor.commands.insertContentAt(pos, {
						type: 'image',
						attrs: { src: source },
					});
				});
			},
			onPaste: (editor, files) => {
				files.forEach(async (file) => {
					const source = await fileToBase64(file);
					editor.commands.insertContent({
						type: 'image',
						attrs: { src: source },
					});
				});
			},
			onValidationError: (errors) => {
				for (const error of errors) {
					toast.error('Image validation error', {
						position: 'bottom-right',
						description: error.reason,
					});
				}
			},
		}),
		GlobalDragHandle.configure({
			dragHandleWidth: 20, // default

			// The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic
			// scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an
			// element to a position that is max. 99px away from the edge of the screen
			// You can set this to 0 to prevent auto scrolling caused by this extension
			scrollTreshold: 100, // default

			// The css selector to query for the drag handle. (eg: '.custom-handle').
			// If handle element is found, that element will be used as drag handle.
			// If not, a default handle will be created
			// dragHandleSelector: '.custom-drag-handle', // default is undefined

			// Tags to be excluded for drag handle
			// If you want to hide the global drag handle for specific HTML tags, you can use this option.
			// For example, setting this option to ['p', 'hr'] will hide the global drag handle for <p> and <hr> tags.
			excludedTags: [],

			// Custom nodes to be included for drag handle
			// For example having a custom Alert component. Add data-type="alert" to the node component wrapper.
			// Then add it to this list as ['alert']
			//
			customNodes: [],
		}),
		Placeholder.configure({ placeholder: () => placeholder }),
	];

	if (slashCommands) {
		extensions.push(
			Slash.configure({
				suggestion: {
					items: () => slashCommands,
				},
			}),
		);
	}

	return extensions;
}

export function useTiptapEditor({
	value,
	output = 'html',
	placeholder = '',
	editorClassName,
	throttleDelay = 0,
	onUpdate,
	onBlur,
	slashCommands,
	...props
}: UseTiptapEditorProps) {
	const throttledSetValue = useThrottle(
		(value: Content) => onUpdate?.(value),
		throttleDelay,
	);

	const handleUpdate = React.useCallback(
		(editor: Editor) => {
			throttledSetValue(getOutput(editor, output));
		},
		[output, throttledSetValue],
	);

	const handleCreate = React.useCallback(
		(editor: Editor) => {
			if (value && editor.isEmpty) {
				editor.commands.setContent(value);
			}
		},
		[value],
	);

	const handleBlur = React.useCallback(
		(editor: Editor) => onBlur?.(getOutput(editor, output)),
		[output, onBlur],
	);

	const editor = useEditor({
		extensions: createExtensions({ placeholder, slashCommands }),
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				class: cn('focus:outline-hidden', editorClassName, {
					'px-8': props.editable,
				}),
			},
			handleDOMEvents: {
				keydown: (_, v) => enableKeyboardNavigation(v),
			},
		},
		onUpdate: ({ editor }) => {
			handleUpdate(editor);
		},
		onCreate: ({ editor }) => {
			handleCreate(editor);
		},
		onBlur: ({ editor }) => handleBlur(editor),
		...props,
	});
	return editor;
}

export default useTiptapEditor;
