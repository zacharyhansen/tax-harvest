import { Button } from '@repo/ui/components/button';
import { CircleArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

export default function LinkCell({ href }: Readonly<{ href: string }>) {
	return (
		<Link href={href} className="flex items-center justify-center">
			<Button variant="ghost" className="p-2">
				<CircleArrowOutUpRight size={16} />
			</Button>
		</Link>
	);
}
