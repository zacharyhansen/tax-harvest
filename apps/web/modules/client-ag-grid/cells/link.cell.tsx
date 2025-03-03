import Link from 'next/link';
import { CircleArrowOutUpRight } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

export default function LinkCell({ href }: Readonly<{ href: string }>) {
  return (
    <Link href={href} className="flex items-center justify-center">
      <Button variant="ghost" className="p-2">
        <CircleArrowOutUpRight size={16} />
      </Button>
    </Link>
  );
}
