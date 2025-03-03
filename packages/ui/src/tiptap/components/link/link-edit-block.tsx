import * as React from 'react';

import { Switch } from '@repo/ui/components/switch';
import { Button } from '@repo/ui/components/button';
import { Label } from '@repo/ui/components/label';
import { Input } from '@repo/ui/components/input';
import { cn } from '@repo/ui/utils';

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

export const LinkEditBlock = React.forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultIsNewTab, defaultUrl, defaultText, className }, ref) => {
    const formReference = React.useRef<HTMLDivElement>(null);
    const [url, setUrl] = React.useState(defaultUrl ?? '');
    const [text, setText] = React.useState(defaultText ?? '');
    const [isNewTab, setIsNewTab] = React.useState(defaultIsNewTab ?? false);

    const handleSave = React.useCallback(
      (event: React.FormEvent) => {
        event.preventDefault();
        if (formReference.current) {
          const isValid = Array.from(
            formReference.current.querySelectorAll('input')
          ).every(input => input.checkValidity());

          if (isValid) {
            onSave(url, text, isNewTab);
          } else {
            for (const input of formReference.current.querySelectorAll(
              'input'
            )) {
              if (!input.checkValidity()) {
                input.reportValidity();
              }
            }
          }
        }
      },
      [onSave, url, text, isNewTab]
    );

    React.useImperativeHandle(ref, () => formReference.current!);

    return (
      <div ref={formReference}>
        <div className={cn('space-y-4', className)}>
          <div className="space-y-1">
            <Label>URL</Label>
            <Input
              type="url"
              required
              placeholder="Enter URL"
              value={url}
              onChange={event => {
                setUrl(event.target.value);
              }}
            />
          </div>

          <div className="space-y-1">
            <Label>Display Text (optional)</Label>
            <Input
              type="text"
              placeholder="Enter display text"
              value={text}
              onChange={event => {
                setText(event.target.value);
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label>Open in New Tab</Label>
            <Switch checked={isNewTab} onCheckedChange={setIsNewTab} />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

LinkEditBlock.displayName = 'LinkEditBlock';

export default LinkEditBlock;
