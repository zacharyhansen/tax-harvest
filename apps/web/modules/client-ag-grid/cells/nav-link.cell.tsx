import Link from 'next/link';
import { Button } from '@repo/ui/components/button';

export default function NavLinkCell({
  href,
  label,
}: Readonly<{ href: string; label: string }>) {
  return (
    <Link href={href} className="hover:text-primary">
      <Button variant="link" className="p-0">
        {label}
      </Button>
    </Link>
  );
}
