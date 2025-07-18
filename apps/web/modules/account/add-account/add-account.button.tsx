import { Button, type ButtonProps } from '@repo/ui/components/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function AddAccountButton({ ...props }: ButtonProps) {
  return (
    <Link href="/onboarding">
      <Button {...props}>
        <Plus className="mr-2 size-4" />
        Add Account
      </Button>
    </Link>
  );
}