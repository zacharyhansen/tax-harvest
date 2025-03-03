'use client';

import { Editor } from '@monaco-editor/react';

import { LayoutWrapper } from '~/modules/layout';

const language = 'sql';

export default function Page() {
  return (
    <LayoutWrapper title="Query Playground">
      <div className="h-full w-full rounded-lg border py-2">
        <Editor
          language={language}
          onMount={editor => {
            editor.onKeyDown(event => {
              // onKeyDownRef.current?.(event);
            });

            if (language === 'json' || language === 'sql') {
              const formatValue = () => {
                const current = editor.getValue();
                // const formatted = tryFormat(language, current) ?? current;
                // editor.setValue(formatted);
              };

              formatValue();
              editor.onDidBlurEditorWidget(formatValue);
            }
          }}
        />
      </div>
    </LayoutWrapper>
  );
}
