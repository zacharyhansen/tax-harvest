import type { Editor } from '@tiptap/core';
import { Fragment, type Node } from '@tiptap/pm/model';

import type { TiptapBaseProps } from '@repo/ui/tiptap/molecules/tiptap-base';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getUrlFromString(string_: string) {
  if (isValidUrl(string_)) return string_;
  try {
    if (string_.includes('.') && !string_.includes(' ')) {
      return new URL(`https://${string_}`).toString();
    }
  } catch {
    return null;
  }
}

// Get the text before a given position in markdown format
export const getPreviousText = (editor: Editor, position: number) => {
  const nodes: Node[] = [];
  // @ts-expect-error coming form the livbrary directly
  for (const [pos, node] of editor.state.doc.entries()) {
    if (pos >= position) {
      continue;
    }
    nodes.push(node);
  }
  const fragment = Fragment.fromArray(nodes);
  const document_ = editor.state.doc.copy(fragment);

  return editor.storage.markdown.serializer.serialize(document_) as string;
};

// Get all content from the editor in markdown format
export const getAllContent = (editor: Editor) => {
  const fragment = editor.state.doc.content;
  const document_ = editor.state.doc.copy(fragment);

  return editor.storage.markdown.serializer.serialize(document_) as string;
};

export function generateRandomFieldName(prefix = 'name', length = 10): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let index = 0; index < length; index++) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return `${prefix}_${randomString}`;
}

interface ShortcutKeyResult {
  symbol: string;
  readable: string;
}

export interface FileError {
  file: File | string;
  reason: 'type' | 'size' | 'invalidBase64' | 'base64NotAllowed';
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxFileSize?: number;
  allowBase64: boolean;
}

type FileInput = File | { src: string | File; alt?: string; title?: string };

export const isClient = (): boolean => typeof window !== 'undefined';
export const isServer = (): boolean => !isClient();
export const isMacOS = (): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
  isClient() && window.navigator.platform === 'MacIntel';

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS()
    ? { symbol: '⌘', readable: 'Command' }
    : { symbol: 'Ctrl', readable: 'Control' },
  alt: isMacOS()
    ? { symbol: '⌥', readable: 'Option' }
    : { symbol: 'Alt', readable: 'Alt' },
  shift: { symbol: '⇧', readable: 'Shift' },
};

export const getShortcutKey = (key: string): ShortcutKeyResult =>
  shortcutKeyMap[key.toLowerCase()] ?? { symbol: key, readable: key };

export const getShortcutKeys = (keys: string[]): ShortcutKeyResult[] =>
  keys.map(element => getShortcutKey(element));

export const getOutput = (
  editor: Editor,
  format: TiptapBaseProps['output']
): object | string => {
  switch (format) {
    case 'json': {
      return editor.getJSON();
    }
    case 'html': {
      return editor.getText() ? editor.getHTML() : '';
    }
    default: {
      return editor.getText();
    }
  }
};

export const isUrl = (
  text: string,
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  options: { requireHostname: boolean; allowBase64?: boolean } = {
    requireHostname: false,
  }
): boolean => {
  if (text.includes('\n')) return false;

  try {
    const url = new URL(text);
    const blockedProtocols = [
      // eslint-disable-next-line sonarjs/code-eval
      'javascript:',
      'file:',
      'vbscript:',
      ...(options.allowBase64 ? [] : ['data:']),
    ];

    if (blockedProtocols.includes(url.protocol)) return false;
    if (options.allowBase64 && url.protocol === 'data:')
      return /^data:image\/[a-z]+;base64,/.test(text);
    if (url.hostname) return true;

    return (
      url.protocol !== '' &&
      (url.pathname.startsWith('//') || url.pathname.startsWith('http')) &&
      !options.requireHostname
    );
  } catch {
    return false;
  }
};

export const sanitizeUrl = (
  url: string | null | undefined,
  options: { allowBase64?: boolean } = {}
): string | undefined => {
  if (!url) return undefined;

  if (options.allowBase64 && url.startsWith('data:image')) {
    return isUrl(url, { requireHostname: false, allowBase64: true })
      ? url
      : undefined;
  }

  return isUrl(url, {
    requireHostname: false,
    allowBase64: options.allowBase64,
  }) || /^(\/|#|mailto:|sms:|fax:|tel:)/.test(url)
    ? url
    : `https://${url}`;
};

export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to base64'));
      }
    };
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// eslint-disable-next-line sonarjs/pseudo-random
export const randomId = (): string => Math.random().toString(36).slice(2, 11);

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert File to base64'));
      }
    };
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const validateFileOrBase64 = <T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[]
): void => {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options);

  if (isValidType && isValidSize) {
    validFiles.push(originalFile);
  } else {
    if (!isValidType) errors.push({ file: input, reason: 'type' });
    if (!isValidSize) errors.push({ file: input, reason: 'size' });
  }
};

const checkTypeAndSize = (
  input: File | string,
  { allowedMimeTypes, maxFileSize }: FileValidationOptions
): { isValidType: boolean; isValidSize: boolean } => {
  const mimeType = input instanceof File ? input.type : base64MimeType(input);
  const size =
    input instanceof File ? input.size : atob(input.split(',')[1] ?? '').length;

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split('/')[0]}/*`);

  const isValidSize = !maxFileSize || size <= maxFileSize;

  return { isValidType, isValidSize };
};

const base64MimeType = (encoded: string): string => {
  // eslint-disable-next-line sonarjs/slow-regex
  const result = /data:([\dA-Za-z]+\/[\d+.A-Za-z-]+).*,.*/.exec(encoded);
  return result && result.length > 1 ? (result[1] ?? 'unknown') : 'unknown';
};

const isBase64 = (string_: string): boolean => {
  if (string_.startsWith('data:')) {
    const matches = /^data:[^;]+;base64,(.+)$/.exec(string_);
    if (matches?.[1]) {
      string_ = matches[1];
    } else {
      return false;
    }
  }

  try {
    return btoa(atob(string_)) === string_;
  } catch {
    return false;
  }
};

export const filterFiles = <T extends FileInput>(
  files: T[],
  options: FileValidationOptions
  // eslint-disable-next-line sonarjs/cognitive-complexity
): [T[], FileError[]] => {
  const validFiles: T[] = [];
  const errors: FileError[] = [];

  for (const file of files) {
    const actualFile = 'src' in file ? file.src : file;

    if (actualFile instanceof File) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors);
    } else if (typeof actualFile === 'string') {
      if (isBase64(actualFile)) {
        if (options.allowBase64) {
          validateFileOrBase64(actualFile, options, file, validFiles, errors);
        } else {
          errors.push({ file: actualFile, reason: 'base64NotAllowed' });
        }
      } else if (
        sanitizeUrl(actualFile, { allowBase64: options.allowBase64 })
      ) {
        validFiles.push(file);
      } else {
        errors.push({ file: actualFile, reason: 'invalidBase64' });
      }
    }
  }

  return [validFiles, errors];
};
